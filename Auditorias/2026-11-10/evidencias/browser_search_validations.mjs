import fs from 'node:fs/promises';
const t=(await (await fetch('http://127.0.0.1:9227/json/list')).json()).find(x=>x.type==='page');
const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let i=1;const p=new Map();
ws.onmessage=e=>{let x=JSON.parse(e.data);if(x.id){let c=p.get(x.id);if(c){p.delete(x.id);clearTimeout(c.timer);x.error?c.reject(x.error):c.resolve(x.result)}}};
const call=(method,params={})=>new Promise((resolve,reject)=>{let id=i++,timer=setTimeout(()=>reject(Error(method+' timeout')),10000);p.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}))});
const sleep=t=>new Promise(r=>setTimeout(r,t));
const js=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)return {error:r.exceptionDetails.exception?.description??r.exceptionDetails.text};return r.result?.value};
await call('Page.enable');await call('Runtime.enable');
const out=[];
for(const [name,term] of [['sources','World Economic Outlook'],['companies','Microsoft']]){
 await call('Page.navigate',{url:'http://127.0.0.1:5179/?t='+name});await sleep(2000);
 const before=await js("({counter:document.querySelector('main')?.innerText.match(/\\d+ de \\d+/)?.[0],rows:document.querySelectorAll('main tbody tr').length,articles:document.querySelectorAll('main article').length})");
 const focus=await js("(()=>{let e=document.querySelector('main input');if(!e)return {error:'no input'};e.focus();return {placeholder:e.placeholder,value:e.value}})()");
 if(!focus.error)await call('Input.insertText',{text:term});
 await sleep(1200);
 const after=await js("({value:document.querySelector('main input')?.value,counter:document.querySelector('main')?.innerText.match(/\\d+ de \\d+/)?.[0],rows:document.querySelectorAll('main tbody tr').length,articles:document.querySelectorAll('main article').length,hasSearch:document.querySelector('main')?.innerText.includes(''+("+JSON.stringify(term)+"))})");
 const r={name,term,before,focus,after};out.push(r);console.log(JSON.stringify(r));
}
await fs.writeFile(new URL('browser_search_validations.json',import.meta.url),JSON.stringify(out,null,2));ws.close();process.exit(0);
