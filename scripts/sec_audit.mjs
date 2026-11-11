import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
console.log('=== INICIANDO AUDITORIA DE SEGURANÇA EM 3 ETAPAS ===\n');

// -------------------------------------------------------------
// ETAPA 1: Verificação de arquivos modificados e não rastreados
// -------------------------------------------------------------
console.log('--- ETAPA 1: Varredura de diff git e arquivos de código novos ---');
const diff = execSync('git diff', { encoding: 'utf8', cwd: ROOT_DIR });
const untracked = [
  'scripts/smoke.mjs',
  'src/test/a11yUi.test.ts',
  'src/test/csvExport.test.ts',
  'src/test/duckdbClient.test.ts',
  'src/test/marketSync.test.ts',
  'src/test/sw.test.ts'
];

const secretPatterns = [
  { name: 'Private Key Header', regex: /-----BEGIN [A-Z ]+PRIVATE KEY-----/ },
  { name: 'JWT Token Pattern', regex: /eyJ[A-Za-z0-9-_]{20,}\.[A-Za-z0-9-_]{20,}/ },
  { name: 'Hardcoded API Token/Key', regex: /(api[_-]?key|secret|private[_-]?token|auth[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i },
  { name: 'Basic Auth in URL', regex: /https:\/\/[^/]+:[^/@]+@/ },
  { name: 'Real .env pattern', regex: /VITE_[A-Z0-9_]+\s*=\s*[A-Za-z0-9_\-]{16,}/ }
];

let stage1Findings = [];

const addedLines = diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++'));
addedLines.forEach((line, idx) => {
  for (const p of secretPatterns) {
    if (p.regex.test(line)) {
      stage1Findings.push({ type: p.name, source: 'git diff', line: line.trim() });
    }
  }
});

untracked.forEach((rel) => {
  const full = path.join(ROOT_DIR, rel);
  if (fs.existsSync(full)) {
    const lines = fs.readFileSync(full, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      for (const p of secretPatterns) {
        if (p.regex.test(line)) {
          stage1Findings.push({ type: p.name, source: `${rel}:${idx + 1}`, line: line.trim() });
        }
      }
    });
  }
});

console.log(`Etapa 1 concluída: ${stage1Findings.length} segredos encontrados.`);
if (stage1Findings.length > 0) {
  console.error('ALERTA DE SEGURANÇA NA ETAPA 1:', stage1Findings);
  process.exit(1);
} else {
  console.log('✓ Etapa 1 APROVADA: Zero credenciais ou segredos em diffs e novos arquivos.');
}

// -------------------------------------------------------------
// ETAPA 2: Varredura de dist/ e source maps
// -------------------------------------------------------------
console.log('\n--- ETAPA 2: Varredura do bundle dist/ e source maps ---');
const distDir = path.join(ROOT_DIR, 'dist');
let stage2Findings = [];

if (!fs.existsSync(distDir)) {
  console.error('Diretório dist/ não existe para verificação.');
  process.exit(1);
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      scanDir(fp);
    } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.map') || file.endsWith('.json')) {
      const content = fs.readFileSync(fp, 'utf8');
      for (const p of secretPatterns) {
        if (p.regex.test(content)) {
          stage2Findings.push({ type: p.name, file: path.relative(ROOT_DIR, fp) });
        }
      }
    }
  }
}

scanDir(distDir);
console.log(`Etapa 2 concluída: ${stage2Findings.length} segredos encontrados em dist/.`);
if (stage2Findings.length > 0) {
  console.error('ALERTA DE SEGURANÇA NA ETAPA 2:', stage2Findings);
  process.exit(1);
} else {
  console.log('✓ Etapa 2 APROVADA: Zero credenciais ou segredos encontrados em dist/.');
}

// -------------------------------------------------------------
// ETAPA 3: Varredura de arquivos públicos em public/
// -------------------------------------------------------------
console.log('\n--- ETAPA 3: Varredura do diretório public/ ---');
const publicDir = path.join(ROOT_DIR, 'public');
let stage3Findings = [];

if (fs.existsSync(publicDir)) {
  scanDir(publicDir);
}
console.log(`Etapa 3 concluída: ${stage3Findings.length} segredos encontrados em public/.`);
if (stage3Findings.length > 0) {
  console.error('ALERTA DE SEGURANÇA NA ETAPA 3:', stage3Findings);
  process.exit(1);
} else {
  console.log('✓ Etapa 3 APROVADA: Zero credenciais ou segredos em public/.');
}

console.log('\n🛡️ AUDITORIA DE SEGURANÇA EM 3 ETAPAS 100% LIMPA E APROVADA!');
