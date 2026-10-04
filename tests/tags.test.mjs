import { test } from "node:test";
import assert from "node:assert/strict";
import { sourceLoader } from "./load-source.mjs";

const tags = () => sourceLoader()("src/lib/portfolio/tags.ts");

test("tag slugs are URL-safe and normalize messy input", () => {
  const { slugifyTag } = tags();
  assert.equal(slugifyTag("Mixroom.ai"), "mixroom-ai");
  assert.equal(slugifyTag("Korea-Blockchain-Week"), "korea-blockchain-week");
  assert.equal(slugifyTag("  Voice Assistant  "), "voice-assistant");
  assert.equal(slugifyTag("C++ & Rust!"), "c-rust");
  assert.equal(slugifyTag("---"), "");
});

test("tag normalization dedupes, caps, and keeps display labels", () => {
  const { normalizeTags, normalizeTag, MAX_TAGS_PER_ITEM } = tags();
  const eleven = normalizeTag("ElevenLabs");
  assert.equal(eleven.slug, "elevenlabs");
  assert.equal(eleven.label, "ElevenLabs");
  assert.equal(normalizeTag("   "), null);

  const normalized = normalizeTags(["Seoul", "seoul", "Korea Blockchain Week"]);
  assert.deepEqual([...normalized].map((tag) => tag.slug), ["seoul", "korea-blockchain-week"]);

  const many = normalizeTags(Array.from({ length: 20 }, (_, i) => `tag ${i}`));
  assert.equal(many.length, MAX_TAGS_PER_ITEM);

  assert.deepEqual(
    [...normalizeTags("hackathon, seoul\nlovable")].map((tag) => tag.slug),
    ["hackathon", "seoul", "lovable"]
  );
});

test("labelFromSlug produces readable fallbacks", () => {
  const { labelFromSlug } = tags();
  assert.equal(labelFromSlug("spring-boot"), "Spring Boot");
  assert.equal(labelFromSlug("aws"), "AWS");
  assert.equal(labelFromSlug("voice-assistant"), "Voice Assistant");
});

test("parseTagInput accepts JSON labels and comma fallback, rejecting junk", () => {
  const { parseTagInput } = tags();
  assert.deepEqual(
    [...parseTagInput(JSON.stringify(["Hackathon", "Mixroom.ai"]))].map((tag) => tag.slug),
    ["hackathon", "mixroom-ai"]
  );
  assert.deepEqual([...parseTagInput("seoul, daw")].map((tag) => tag.slug), ["seoul", "daw"]);
  assert.deepEqual([...parseTagInput(null)], []);
  assert.deepEqual([...parseTagInput("")], []);
});

test("content tag schema strips duplicates and rejects malformed slugs", () => {
  const { contentTagsSchema, tagSlugSchema } = tags();
  assert.deepEqual([...contentTagsSchema.parse(["seoul", "seoul", "daw"])], ["seoul", "daw"]);
  assert.deepEqual([...contentTagsSchema.parse(undefined)], []);
  assert.equal(tagSlugSchema.safeParse("Seoul").success, false);
  assert.equal(tagSlugSchema.safeParse("has space").success, false);
  assert.equal(tagSlugSchema.safeParse("korea-blockchain-week").success, true);
  assert.equal(contentTagsSchema.safeParse(Array.from({ length: 13 }, (_, i) => `t${i}`)).success, false);
});
