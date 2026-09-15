import { test } from "node:test";
import assert from "node:assert/strict";
import { sourceLoader } from "./load-source.mjs";

const payload = {
  fullname: "Test Visitor",
  email: "visitor@example.com",
  message: "A test project brief for local verification.",
};
function setup({
  configured = false,
  email = false,
  stored = false,
  emailed = false,
} = {}) {
  const calls = { stored: 0, emailed: 0 };
  const load = sourceLoader(
    {
      "@/lib/supabase/env": { isSupabaseConfigured: () => configured },
      "@/lib/supabase/admin": {
        createServiceClient: () => ({
          from: () => ({
            insert: async () => {
              calls.stored++;
              return {
                error: stored ? null : { message: "mock storage failure" },
              };
            },
          }),
        }),
      },
    },
    {
      process: {
        env: {
          ...(configured ? { SUPABASE_SERVICE_ROLE_KEY: "mock" } : {}),
          ...(email ? { RESEND_API_KEY: "mock" } : {}),
        },
      },
      fetch: async () => {
        calls.emailed++;
        return { ok: emailed, text: async () => "mock delivery failure" };
      },
    },
  );
  const { POST } = load("src/app/api/contact/route.ts");
  return {
    calls,
    send: (body = payload) =>
      POST({
        headers: new Headers({ "x-forwarded-for": "127.0.0.1" }),
        json: async () => body,
      }),
  };
}

test("unconfigured delivery returns 503, never false success", async () => {
  const { send, calls } = setup();
  const response = await send();
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /email link/);
  assert.deepEqual(calls, { stored: 0, emailed: 0 });
});
for (const scenario of [
  {
    name: "storage succeeds while email fails",
    configured: true,
    email: true,
    stored: true,
    emailed: false,
    status: 200,
  },
  {
    name: "email succeeds while storage fails",
    configured: true,
    email: true,
    stored: false,
    emailed: true,
    status: 200,
  },
  {
    name: "both fail",
    configured: true,
    email: true,
    stored: false,
    emailed: false,
    status: 502,
  },
  {
    name: "email only succeeds",
    configured: false,
    email: true,
    emailed: true,
    status: 200,
  },
])
  test(scenario.name, async () =>
    assert.equal((await setup(scenario).send()).status, scenario.status),
  );

test("invalid and oversized requests never reach delivery", async () => {
  for (const body of [
    { ...payload, email: "invalid" },
    { ...payload, message: "short" },
    { ...payload, fullname: "A".repeat(101) },
    { ...payload, message: "A".repeat(5001) },
  ]) {
    const { send, calls } = setup({ configured: true, stored: true });
    assert.equal((await send(body)).status, 400);
    assert.equal(calls.stored, 0);
  }
});
test("rate limit returns 429 after five requests", async () => {
  const { send } = setup({ email: true, emailed: true });
  for (let i = 0; i < 5; i++) assert.equal((await send()).status, 200);
  assert.equal((await send()).status, 429);
});
