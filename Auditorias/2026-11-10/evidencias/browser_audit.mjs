import fs from 'node:fs/promises';
const base='http://127.0.0.1:5179/';
const targets=await (await fetch('http://127.0.0.1:9227/json/list')).json();
const t=targets.find(x=>x.type==='page');
if(!t) throw Error('No page target');
const ws=new WebSocket(t.webSocketDebuggerUrl);
await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true});ws.addEventListener('error',rej,{once:true});});
let id=1;const waiting=new Map();const events=[];
ws.addEventListener('message',e=>{
 let v;try{v=JSON.parse(e.data)}catch{return}
 if(v.id){const x=waiting.get(v.id);if(x){waiting.delete(v.id);clearTimeout(x.timer);v.error?x.reject(Error(JSON.stringify(v.error))):x.resolve(v.result)}}
 else if(v.method==='Runtime.exceptionThrown'){events.push({kind:'exception',message:v.params?.exceptionDetails?.text,description:v.params?.exceptionDetails?.exception?.description?.slice(0,500)})}
 else if(v.method==='Log.entryAdded' && v.params?.entry?.level==='error'){events.push({kind:'console',message:v.params.entry.text?.slice(0,400)})}
 else if(v.method==='Network.responseReceived' && v.params?.response?.status>=400){events.push({kind:'http',status:v.params.response.status,url:v.params.response.url.replace(/\?.*$/,'?redacted')})}
});
function send(method,params={}){return new Promise((resolve,reject)=>{const k=id++;const timer=setTimeout(()=>{waiting.delete(k);reject(Error('CDP timeout '+method))},18000);waiting.set(k,{resolve,reject,timer});ws.send(JSON.stringify({id:k,method,params}))})}
const sleep=t=>new Promise(r=>setTimeout(r,t));
await send('Page.enable');await send('Runtime.enable');await send('Log.enable');await send('Network.enable');
async function evalJS(expr){const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});return r.result?.value??null}
const expression="(()=>{const m=document.querySelector('main'),h=m?.querySelector('h2');const inputs=[...document.querySelectorAll('input,textarea,select')];return {title:document.title,header:h?.textContent?.trim().slice(0,130),textLength:m?.innerText?.length??0,bodyLength:document.body.innerText.length,buttons:document.querySelectorAll('button').length,unlabeledFields:inputs.filter(e=>!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')&&!e.labels?.length).length,overflowX:document.documentElement.scrollWidth>innerWidth+2,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,bodyText:document.body.innerText.slice(0,300),status:document.readyState}})()";
async function scenario(tab,opt={}){
 const label=opt.label??tab, evStart=events.length;
 if(opt.mobile){await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:2,mobile:true})}
 else{await send('Emulation.clearDeviceMetricsOverride')}
 await send('Page.navigate',{url:base+'?t='+tab+(opt.extra??'')});
 await sleep(opt.delay??(tab==='globe3d'?7500:tab==='home'?3800:tab==='sources'?3500:2100));
 const state=await evalJS(expression);
 const item={label,viewport:opt.mobile?'375x812':'1440x1000',...state,events:events.slice(evStart)};
 if(opt.screenshot){
 try{const s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const filename='UI_'+label.replace(/[^a-z0-9_-]/gi,'_')+'.png';await fs.writeFile(new URL(filename,import.meta.url),Buffer.from(s.data,'base64'));item.screenshot=filename}
 catch(e){item.screenshotError=e.message}
 }
 console.log(JSON.stringify(item));return item;
}
const all=[];
for(const tab of ['home','circuit','war','debt','companies','platform','wealth','consequences','alternatives','sources','settings','globe3d']){
 try{all.push(await scenario(tab,{screenshot:['home','companies','settings','sources','globe3d'].includes(tab)}))}
 catch(e){all.push({label:tab,error:String(e)});console.log('SCENARIO_ERR '+tab+' '+e)}
}
for(const tab of ['home','companies','sources','settings']){
 try{all.push(await scenario(tab,{mobile:true,label:'mobile_'+tab,delay:3100,screenshot:true}))}
 catch(e){all.push({label:'mobile_'+tab,error:String(e)});console.log('SCENARIO_ERR '+tab+' '+e)}
}
for(const [tab,extra,label] of [['companies','&l=en&m=simples','en_simple_companies'],['debt','&l=es&m=avancado','es_advanced_debt']]){
 try{all.push(await scenario(tab,{label,extra}))}
 catch(e){all.push({label,error:String(e)})}
}
await fs.writeFile(new URL('browser_scenarios.json',import.meta.url),JSON.stringify({generated:new Date().toISOString(),scenarios:all},null,2),'utf8');
console.log('DONE '+all.length);ws.close();process.exit(0);
