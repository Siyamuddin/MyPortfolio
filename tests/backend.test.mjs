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
test('agent API rejects absent key configuration',()=>{
 const {guardAgentRequest}=sourceLoader({}, {Buffer})('src/lib/agent/auth.ts');assert.equal(guardAgentRequest(request()).status,503);
});
test('agent API rejects missing/wrong bearer and accepts configured bearer',()=>{
 const {guardAgentRequest}=sourceLoader({}, {Buffer,process:{env:{BLOG_API_KEY:'test-only-key'}}})('src/lib/agent/auth.ts');
 assert.equal(guardAgentRequest(request()).status,401);assert.equal(guardAgentRequest(request('Bearer invalid')).status,401);assert.equal(guardAgentRequest(request('Bearer test-only-key')),null);
});
test('admin actions must reject a signed-in non-admin',async()=>{
 const load=sourceLoader({'next/cache':{},'next/navigation':{},'@/lib/portfolio/repository':{},'@/lib/supabase/env':{isSupabaseConfigured:()=>true},'@/lib/supabase/server':{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'non-admin',app_metadata:{}}}})},rpc:async()=>({data:false,error:null})})}});
 await assert.rejects(()=>load('src/lib/portfolio/auth-actions.ts').requireAdmin());
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
test('project card website and source must have independent links',()=>{
 const {ProjectCard}=sourceLoader({'next/image':()=>null})('src/components/portfolio/ProjectCard.tsx');
 const html=renderToStaticMarkup(React.createElement(ProjectCard,{project:{title:'Example',category:'Applications',image:'/image.png',url:'https://example.com',githubUrl:'https://github.com/example/repo',description:'Example'}}));
 assert.match(html,/href="https:\/\/github.com\/example\/repo"/);
});
test('MDX 6 defaults block JavaScript expressions',async()=>{
 const {serialize}=await import(pathToFileURL(resolve('node_modules/next-mdx-remote/dist/serialize.js')).href);const result=await serialize('Hello {40 + 2}');assert.equal(result.compiledSource.includes('40 + 2'),false);
});