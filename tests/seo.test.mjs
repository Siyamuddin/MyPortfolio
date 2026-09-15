import { test } from "node:test";
import assert from "node:assert/strict";
import { sourceLoader } from "./load-source.mjs";
import { renderToStaticMarkup } from "react-dom/server";

const load = sourceLoader();
const { profile, blogPosts } = load("src/data/portfolio.ts");
const { buildProfileAwarePageSeo, pathToNavPage, pagePaths, SITE_URL } =
  load("src/lib/seo.ts");
const { JsonLdScript, buildPersonNode } = load("src/lib/seo/jsonld.tsx");

test("metadata uses a distinct canonical and description for every public page", () => {
  const descriptions = new Set();
  for (const [page, path] of Object.entries(pagePaths)) {
    const metadata = buildProfileAwarePageSeo(profile, page);
    assert.equal(
      metadata.alternates.canonical,
      path === "/" ? SITE_URL : SITE_URL + path,
    );
    descriptions.add(metadata.description);
  }
  assert.equal(descriptions.size, 5);
});
test("nested blog pages select Writing and unrelated prefixes do not", () => {
  assert.equal(pathToNavPage("/blog/article/"), "blog");
  assert.equal(pathToNavPage("/blogger"), "about");
});
test("structured data does not invent current employment or expose closing script tags", () => {
  const person = buildPersonNode(profile, {
    experience: [{ company: "Past employer" }],
  });
  assert.equal(person.worksFor, undefined);
  const html = renderToStaticMarkup(
    JsonLdScript({ data: { name: "</script><script>bad()</script>" } }),
  );
  assert.equal((html.match(/<script/g) || []).length, 1);
  assert.match(html, /\\u003c/);
});
test("sitemap excludes drafts and empty articles and does not invent dates", async () => {
  const portfolio = {
    source: "static",
    blogPosts: [
      blogPosts[0],
      { ...blogPosts[0], slug: "draft", status: "draft" },
      { ...blogPosts[0], slug: "empty", body: "" },
    ],
  };
  const sitemap = sourceLoader({
    "@/lib/portfolio/repository": {
      getPortfolio: async () => portfolio,
      getPortfolioFreshness: async () => undefined,
    },
  })("src/app/sitemap.ts").default;
  const entries = await sitemap();
  assert.equal(entries.length, 6);
  assert.ok(entries.every((entry) => !("lastModified" in entry)));
  assert.ok(entries.every((entry) => !/\/(draft|empty)$/.test(entry.url)));
});
test("configured CMS cannot resurrect a static article when unpublished or unavailable", async () => {
  for (const error of [null, new Error("CMS offline")]) {
    const query = {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle: async () => ({ data: null, error }),
    };
    const repository = sourceLoader(
      {
        react: { cache: (fn) => fn },
        "next/cache": { unstable_cache: (fn) => fn },
        "@supabase/supabase-js": {
          createClient: () => ({ from: () => query }),
        },
        "@/lib/supabase/env": { isSupabaseConfigured: () => true },
      },
      {
        process: {
          env: {
            NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock",
          },
        },
      },
    )("src/lib/portfolio/repository.ts");
    assert.equal(await repository.getBlogPostBySlug(blogPosts[0].slug), null);
  }
});
test("project website and source are independent links", () => {
  const { ProjectLinks } = load("src/components/portfolio/ProjectLinks.tsx");
  const html = renderToStaticMarkup(
    ProjectLinks({
      project: {
        title: "Example",
        url: "https://example.com",
        githubUrl: "https://github.com/example/repo",
      },
    }),
  );
  assert.match(html, /href="https:\/\/example.com\/"/);
  assert.match(html, /href="https:\/\/github.com\/example\/repo"/);
  assert.match(html, /Source code/);
  const profileHtml = renderToStaticMarkup(
    ProjectLinks({
      project: {
        title: "Example",
        url: "",
        githubUrl: "https://github.com/example",
      },
    }),
  );
  assert.match(profileHtml, /GitHub profile/);
  assert.doesNotMatch(profileHtml, /Source code/);
});

test('partial and impossible dates are omitted without inventing dates', () => {
  const { isoDate } = load('src/lib/seo/dates.ts');
  assert.equal(isoDate('2026-02'), undefined);
  assert.equal(isoDate('2026-02-31'), undefined);
  assert.equal(isoDate('2026-09-15'), '2026-09-15');
});

test('local fallback data only references assets present in the repository', async () => {
  const { existsSync } = await import('node:fs');
  const { projects, blogPosts } = load('src/data/portfolio.ts');
  for (const item of [...projects, ...blogPosts]) {
    if (item.image.startsWith('/')) assert.ok(existsSync('public' + item.image), item.image);
  }
});
