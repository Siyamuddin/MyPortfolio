import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {sourceLoader} from './load-source.mjs';
const require=createRequire(resolve('package.json'));
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const request=(authorization='')=>({headers:new Headers({authorization}),cookies:{getAll:()=>[],set(){}}});
test('agent API rejects absent key configuration', async () => {
 const {guardAgentRequest}=sourceLoader({}, {Buffer})('src/lib/agent/auth.ts');assert.equal((await guardAgentRequest(request())).status,503);
});
test('agent API rejects missing/wrong bearer and accepts configured bearer', async () => {
 const {guardAgentRequest}=sourceLoader({}, {Buffer,process:{env:{BLOG_API_KEY:'test-only-key'}}})('src/lib/agent/auth.ts');
 assert.equal((await guardAgentRequest(request())).status,401);assert.equal((await guardAgentRequest(request('Bearer invalid'))).status,401);assert.equal(await guardAgentRequest(request('Bearer test-only-key')),null);
});
test('agent API rate limit uses the shared submission limiter', async () => {
 let calls = 0;
 let rpcName = '';
 let sent = null;
 const load = sourceLoader({
  '@/lib/supabase/env': { isSupabaseConfigured: () => true },
  '@/lib/supabase/admin': { createServiceClient: () => ({ rpc: async (name, args) => { calls += 1; rpcName = name; sent = args; return { data: false, error: null }; } }) },
 }, { Buffer, process: { env: { BLOG_API_KEY: 'test-only-key', NODE_ENV: 'production', SUPABASE_SERVICE_ROLE_KEY: 'test-only', VERCEL: '1' } } });
 const { guardAgentRequest } = load('src/lib/agent/auth.ts');
 assert.equal((await guardAgentRequest(request())).status, 401);
 assert.equal(calls, 0);
 const blocked = await guardAgentRequest({ headers: new Headers({ authorization: 'Bearer test-only-key', 'x-forwarded-for': '203.0.113.50', 'x-vercel-forwarded-for': '192.0.2.10' }) });
 assert.equal(blocked.status, 429);
 assert.deepEqual(await blocked.json(), { ok: false, error: 'Too many requests. Please try again later.' });
 assert.equal(blocked.headers.get('Retry-After'), '60');
 assert.equal(calls, 1);
 assert.equal(rpcName, 'consume_submission_limit');
 assert.equal(sent.max_requests, 30);
 assert.equal(sent.window_seconds, 60);
 assert.match(sent.key_hash, /^[a-f0-9]{64}$/);
 assert.equal(JSON.stringify(sent).includes('203.0.113.50'), false);
 assert.equal(JSON.stringify(sent).includes('192.0.2.10'), false);
 const agentHash = sent.key_hash;
 const { guardSubmissionRate } = load('src/lib/rate-limit.ts');
 await guardSubmissionRate({ headers: new Headers({ 'x-vercel-forwarded-for': '192.0.2.10', 'x-forwarded-for': '203.0.113.50' }) }, 'contact');
 assert.equal(sent.max_requests, 5);
 assert.notEqual(sent.key_hash, agentHash);
 await guardSubmissionRate({ headers: new Headers({ 'x-vercel-forwarded-for': '192.0.2.10', 'x-forwarded-for': '198.51.100.4' }) }, 'agent');
 assert.equal(sent.key_hash, agentHash);
});
test('agent API fails closed when the shared limiter is unavailable', async () => {
 const { guardAgentRequest } = sourceLoader({
  '@/lib/supabase/env': { isSupabaseConfigured: () => true },
  '@/lib/supabase/admin': { createServiceClient: () => ({ rpc: async () => ({ data: null, error: { code: 'offline' } }) }) },
 }, { Buffer, process: { env: { BLOG_API_KEY: 'test-only-key', NODE_ENV: 'production', SUPABASE_SERVICE_ROLE_KEY: 'test-only' } } })('src/lib/agent/auth.ts');
 const blocked = await guardAgentRequest(request('Bearer test-only-key'));
 assert.equal(blocked.status, 503);
 assert.deepEqual(await blocked.json(), { ok: false, error: 'Agent API is temporarily unavailable.' });
});
test('admin actions must reject a signed-in non-admin',async()=>{
 const load=sourceLoader({'next/cache':{},'next/navigation':{},'@/lib/portfolio/repository':{},'@/lib/supabase/env':{isSupabaseConfigured:()=>true},'@/lib/supabase/server':{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'non-admin',app_metadata:{}}}})},rpc:async()=>({data:false,error:null})})}});
 await assert.rejects(()=>load('src/lib/portfolio/auth.ts').requireAdmin());
});
test('structured data must escape closing script tags',()=>{
 const {JsonLdScript}=sourceLoader()('src/lib/seo/jsonld.tsx');const html=renderToStaticMarkup(React.createElement(JsonLdScript,{data:{text:'</script><script type="audit-marker">'}}));assert.equal(html.includes('</script><script type='),false);
});
test('blog article navigation should mark Blog active',()=>{
 assert.equal(sourceLoader()('src/lib/seo.ts').pathToNavPage('/blog/an-article'),'blog');
});
test('CMS unpublished or removed article must not fall back to a sample article',async()=>{
 const fake={slug:'sample',body:'sample article'};const chain={select(){return this},eq(){return this},maybeSingle:async()=>({data:null,error:null})};
 const load=sourceLoader({'react':{cache:fn=>fn},'next/cache':{unstable_cache:fn=>fn},'@supabase/supabase-js':{createClient:()=>({from:()=>chain})},'@/data/portfolio':{navPages:[]},'@/lib/portfolio/mappers':{},'@/lib/portfolio/static':{getStaticBlogPostBySlug:()=>fake,getStaticPortfolio:()=>({})},'@/lib/supabase/env':{isSupabaseConfigured:()=>true}},{process:{env:{NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',NEXT_PUBLIC_SUPABASE_ANON_KEY:'mock'}}});
 assert.equal(await load('src/lib/portfolio/repository.ts').getBlogPostBySlug('sample'),null);
});
test('project card source link comes from a GitHub project url',()=>{
 const {ProjectCard}=sourceLoader({'next/image':()=>null})('src/components/portfolio/ProjectCard.tsx');
 const html=renderToStaticMarkup(React.createElement(ProjectCard,{project:{title:'Example',category:'Applications',image:'/image.png',url:'https://github.com/example/repo',description:'Example'}}));
 assert.match(html,/href="https:\/\/github.com\/example\/repo"/);
});
test('MDX 6 defaults block JavaScript expressions',async()=>{
 const {serialize}=await import(pathToFileURL(resolve('node_modules/next-mdx-remote/dist/serialize.js')).href);const result=await serialize('Hello {40 + 2}');assert.equal(result.compiledSource.includes('40 + 2'),false);
});