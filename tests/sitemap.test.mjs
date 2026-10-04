import { test } from "node:test";
import assert from "node:assert/strict";
import { sourceLoader } from "./load-source.mjs";

const loadSitemap = () =>
  sourceLoader({
    "@/lib/portfolio/repository": {
      getPortfolio: async () => ({
        blogPosts: [
          { status: "published", body: "content", slug: "post-1", updatedAt: "2026-01-02T00:00:00Z" },
          { status: "draft", body: "", slug: "hidden", updatedAt: undefined },
        ],
      }),
      getPortfolioFreshness: async () => undefined,
    },
    "@/lib/portfolio/events-repository": {
      getPublishedEvents: async () => [
        { slug: "digital-af-seoul", updatedAt: "2026-09-20T00:00:00Z" },
      ],
    },
    "@/lib/portfolio/tags-repository": {
      getTagsWithCounts: async () => [{ slug: "seoul", label: "Seoul", count: 2 }],
    },
  })("src/app/sitemap.ts").default;

test("sitemap includes crawlable event detail URLs with per-event freshness", async () => {
  const entries = await loadSitemap()();
  const event = entries.find((entry) => entry.url.endsWith("/events/digital-af-seoul"));
  assert.ok(event, "event detail URL present");
  assert.ok(event.lastModified, "event has lastModified");
  assert.equal(event.lastModified.toISOString(), "2026-09-20T00:00:00.000Z");
});

test("sitemap lists tag pages, the tags index, and published posts only", async () => {
  const entries = await loadSitemap()();
  const urls = entries.map((entry) => entry.url);
  assert.ok(urls.some((url) => url.endsWith("/tags")));
  assert.ok(urls.some((url) => url.endsWith("/tags/seoul")));
  assert.ok(urls.some((url) => url.endsWith("/blog/post-1")));
  assert.equal(urls.some((url) => url.endsWith("/blog/hidden")), false);
  // Admin and API routes are never emitted in the sitemap.
  assert.equal(urls.some((url) => url.includes("/admin") || url.includes("/api")), false);
});
