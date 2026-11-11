import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=path.resolve(root,'..','..');
const names=['00_LEIA_PRIMEIRO.md','01_RELATORIO_AUDITORIA.md','02_ACHADOS.json','03_PLANO_DE_EXECUCAO.md','04_TESTES_E_VALIDACOES.md','05_TAREFAS_HUMANAS.md','06_PROMPT_PARA_IA.md','PROGRESSO.md'];
const fails=[],warnings=[];
for(const n of names){const p=path.join(root,n);if(!fs.existsSync(p))fails.push('MISSING '+n);else if(fs.statSync(p).size<250)fails.push('TOO_SMALL '+n)}
let data;
try{data=JSON.parse(fs.readFileSync(path.join(root,'02_ACHADOS.json'),'utf8'))}catch(e){fails.push('JSON '+e.message)}
let ids=[],priorities={},states={};
if(data){ids=data.achados.map(x=>x.id);const seen=new Set();for(const x of data.achados){if(seen.has(x.id))fails.push('DUPLICATE '+x.id);seen.add(x.id);priorities[x.prioridade]=(priorities[x.prioridade]??0)+1;states[x.estado]=(states[x.estado]??0)+1;
for(const k of ['id','titulo','categoria','componente','prioridade','gravidade','estado','tipo','descricao','arquivos','evidencias','comportamento_atual','comportamento_esperado','impacto','causa_provavel','riscos','solucao_recomendada','dependencias','criterios_aceitacao','esforco','responsavel'])if(x[k]===undefined)fails.push('MISSING_FIELD '+x.id+' '+k);
for(const p of x.arquivos){if(!fs.existsSync(path.join(app,p)) && !p.startsWith('evidencias/'))fails.push('SOURCE_MISSING '+x.id+' '+p)}
}
if(ids.length!==18)fails.push('WRONG_COUNT '+ids.length);
for(const [k,v] of Object.entries(priorities))if(data.resumo.por_prioridade[k]!==v)fails.push('COUNT_MISMATCH '+k);
for(let i=1;i<=18;i++){const id='AUD-'+String(i).padStart(3,'0');if(!seen.has(id))fails.push('MISSING_ID '+id)}
}
const docs=names.filter(x=>x.endsWith('.md')).map(n=>[n,fs.readFileSync(path.join(root,n),'utf8')]);
for(const [n,txt] of docs){if(txt.includes('\\'+String.fromCharCode(96)))warnings.push('ESCAPED_BACKTICKS '+n);if(n==='06_PROMPT_PARA_IA.md'){for(const id of ids)if(!txt.includes(id))fails.push('PROMPT_NO_ID '+id)} }
for(const f of ['browser_scenarios.json','browser_interactions.json','TEST_build.log','TEST_test.log','TEST_perf_budget.log','dependency_audit_all_raw.json','dependency_audit_raw.json'])if(!fs.existsSync(path.join(root,'evidencias',f)))fails.push('MISSING_EVIDENCE '+f);
for(const f of ['browser_scenarios.json','browser_interactions.json','dependency_audit_all_raw.json','dependency_audit_raw.json']){try{JSON.parse(fs.readFileSync(path.join(root,'evidencias',f),'utf8'))}catch(e){fails.push('EVIDENCE_BAD_JSON '+f+':'+e.message)}}
const report={timestamp:new Date().toISOString(),status:fails.length?'FAIL':'PASS',files:names.map(n=>({name:n,bytes:fs.existsSync(path.join(root,n))?fs.statSync(path.join(root,n)).size:0})),counts:{total:ids.length,priorities,states},sourceRoot:app,errors:fails,warnings,uiScreenshots:fs.readdirSync(path.join(root,'evidencias')).filter(x=>x.startsWith('UI_')&&x.endsWith('.png')).length};
fs.writeFileSync(path.join(root,'evidencias','VALIDACAO_PACOTE.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(fails.length)process.exitCode=1;
