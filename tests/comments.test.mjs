import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sourceLoader} from './load-source.mjs';
const valid={postId:'00000000-0000-4000-8000-000000000001',authorName:'Audit Visitor',authorEmail:'audit@example.com',body:'Local comment validation test.'};
function setup({post=true,insertFails=false,configured=true}={}){
 const calls={inserts:0,notifications:0};const chain={select(){return this},eq(){return this},maybeSingle:async()=>({data:post?{id:valid.postId,title:'Audit',status:'published'}:null,error:null}),insert:async()=>{calls.inserts++;return{error:insertFails?{message:'Mock database failure'}:null}}};
 const POST=sourceLoader({'@/lib/supabase/admin':{createServiceClient:()=>({from:()=>chain})},'@/lib/rate-limit':{guardSubmissionRate:async()=>null},'@/lib/supabase/env':{isSupabaseConfigured:()=>configured},'@/lib/comments/notify':{notifyPendingComment:async()=>{calls.notifications++}}},{process:{env:{NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',NEXT_PUBLIC_SUPABASE_ANON_KEY:'mock',SUPABASE_SERVICE_ROLE_KEY:'mock'}}})('src/app/api/blog/comments/route.ts').POST;
 return{calls,send:(body=valid)=>POST({headers:new Headers({'x-forwarded-for':'127.0.0.1'}),json:async()=>body})};
}
test('valid comment is stored pending and notification is requested',async()=>{const s=setup();assert.equal((await s.send()).status,200);assert.equal(s.calls.inserts,1);assert.equal(s.calls.notifications,1)});
test('invalid comment never reaches database',async()=>{const s=setup();assert.equal((await s.send({...valid,authorEmail:'bad'})).status,400);assert.equal(s.calls.inserts,0)});
test('comment for unavailable post is rejected',async()=>{const s=setup({post:false});assert.equal((await s.send()).status,404);assert.equal(s.calls.inserts,0)});
test('comment insert failure is reported',async()=>{const s=setup({insertFails:true});assert.equal((await s.send()).status,500);assert.equal(s.calls.notifications,0)});
test('comment honeypot suppresses writes',async()=>{const s=setup();assert.equal((await s.send({...valid,website:'https://spam.example'})).status,200);assert.equal(s.calls.inserts,0)});
