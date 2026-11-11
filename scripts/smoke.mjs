#!/usr/bin/env node

/**
 * Capital Blocks — Automated Browser Smoke Test (AUD-010)
 *
 * Runs headless Chrome / Chromium without external network calls,
 * validating:
 * 1. Isolated local HTTP server serving production build (dist/)
 * 2. Navigation through all 10 core modules:
 *    home, circuit, war, debt, companies, platform, wealth,
 *    consequences, alternatives, sources
 * 3. Settings module rendering
 * 4. Dark / Light theme toggle
 * 5. DuckDB SQL query execution:
 *    SELECT COUNT(*) AS total FROM comex_fluxos
 *    verifying it returns count = 18
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

const MODULES = [
  'home',
  'circuit',
  'war',
  'debt',
  'companies',
  'platform',
  'wealth',
  'consequences',
  'alternatives',
  'sources'
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.unref();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const port = s.address().port;
      s.close(() => resolve(port));
    });
  });
}

function startStaticServer(port) {
  const server = http.createServer((req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://127.0.0.1:${port}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      // Strip potential base path prefixes (e.g. /capital-blocks/)
      reqPath = reqPath.replace(/^\/[^/]+(?=\/assets\/|\/sw\.js|\/icon\.svg|\/manifest\.webmanifest)/, '');

      let filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      // SPA fallback
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Error reading file');
      });
      stream.pipe(res);
    } catch (err) {
      res.statusCode = 500;
      res.end(err.message);
    }
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function findBrowserBinary() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }

  const candidates = [];
  if (process.platform === 'win32') {
    const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
    const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const local = process.env['LOCALAPPDATA'] || '';
    candidates.push(
      path.join(pf, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(pf86, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(local, 'Google\\Chrome\\Application\\chrome.exe'),
      path.join(pf86, 'Microsoft\\Edge\\Application\\msedge.exe'),
      path.join(pf, 'Microsoft\\Edge\\Application\\msedge.exe')
    );
  } else if (process.platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    );
  } else {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium'
    );
  }

  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }

  // Fallback: try PATH
  const binaryNames = process.platform === 'win32'
    ? ['chrome.exe', 'msedge.exe']
    : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];

  for (const name of binaryNames) {
    try {
      const checkCmd = process.platform === 'win32' ? `where.exe ${name}` : `which ${name}`;
      const { execSync } = import('node:child_process');
      const out = execSync(checkCmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
      const first = out.split(/\r?\n/)[0];
      if (first && fs.existsSync(first)) return first;
    } catch {
      // ignore
    }
  }

  return null;
}

class CDPClient {
  constructor(ws) {
    this.ws = ws;
    this.msgId = 1;
    this.pending = new Map();

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.id && this.pending.has(payload.id)) {
          const { resolve, reject, timer } = this.pending.get(payload.id);
          clearTimeout(timer);
          this.pending.delete(payload.id);
          if (payload.error) {
            reject(new Error(payload.error.message || JSON.stringify(payload.error)));
          } else {
            resolve(payload.result);
          }
        }
      } catch {
        // ignore malformed cdp packets
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
      throw new Error(`Eval exception: ${desc}`);
    }
    return res.result?.value;
  }

  async waitFor(fn, timeoutMs = 15000, stepMs = 200) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const val = await fn();
        if (val) return val;
      } catch {
        // retry on transient DOM error
      }
      await new Promise((r) => setTimeout(r, stepMs));
    }
    throw new Error(`Timeout waiting for condition after ${timeoutMs}ms`);
  }
}

async function runSmoke() {
  console.log('🚀 Iniciando Smoke Test de Navegador (AUD-010)...');

  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error('❌ Diretório dist/ não encontrado ou incompleto. Execute `npm run build` antes do smoke.');
    process.exit(1);
  }

  const browserBin = findBrowserBinary();
  if (!browserBin) {
    console.error('❌ Nenhum binário do Chrome/Chromium/Edge encontrado no sistema.');
    process.exit(1);
  }
  console.log(`🧭 Navegador localizado: ${browserBin}`);

  const serverPort = await getFreePort();
  const server = await startStaticServer(serverPort);
  console.log(`🌐 Servidor local isolado iniciado em http://127.0.0.1:${serverPort}`);

  const cdpPort = await getFreePort();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cb-smoke-chrome-'));

  const chromeProc = spawn(browserBin, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tmpDir}`,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-sync',
    '--mute-audio',
    '--no-first-run',
    '--window-size=1280,900',
    'about:blank'
  ], { stdio: 'ignore' });

  let cdp = null;
  let ws = null;

  try {
    // Wait for Chrome DevTools endpoint
    let targets = null;
    const startWait = Date.now();
    while (Date.now() - startWait < 15000) {
      try {
        const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
        if (res.ok) {
          targets = await res.json();
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    if (!targets) {
      throw new Error(`Chrome DevTools não respondeu na porta ${cdpPort} em 15s`);
    }

    let pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) {
      const newPageRes = await fetch(`http://127.0.0.1:${cdpPort}/json/new`, { method: 'PUT' });
      pageTarget = await newPageRes.json();
    }

    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });

    cdp = new CDPClient(ws);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('🔗 Conectado ao Chrome DevTools Protocol.');

    const baseUrl = `http://127.0.0.1:${serverPort}/`;

    // 1. Navegar por todos os 10 módulos principais
    console.log('\n--- Testando os 10 Módulos Principais ---');
    for (const mod of MODULES) {
      await cdp.send('Page.navigate', { url: `${baseUrl}?t=${mod}` });
      await cdp.waitFor(async () => {
        const check = await cdp.eval(`(() => {
          const main = document.querySelector('main#conteudo');
          if (!main) return false;
          const text = main.innerText || '';
          if (text.includes('carregando módulo…') || text.includes('loading module…')) return false;
          if (text.includes('Algo deu errado') || text.includes('Error')) return 'ERROR';
          return text.length > 50;
        })()`);
        if (check === 'ERROR') throw new Error(`ErrorBoundary disparado no módulo ${mod}`);
        return check === true;
      }, 12000);
      console.log(`  ✓ Módulo '${mod}' renderizado com sucesso.`);
    }

    // 2. Testar aba Configurações
    console.log('\n--- Testando Configurações ---');
    await cdp.send('Page.navigate', { url: `${baseUrl}?t=settings` });
    await cdp.waitFor(async () => {
      return await cdp.eval(`(() => {
        const h2 = document.querySelector('main h2');
        return !!h2 && h2.innerText.length > 0;
      })()`);
    }, 8000);
    console.log('  ✓ Tela de Configurações carregada.');

    // 3. Alternância de Tema (Escuro / Claro)
    console.log('\n--- Testando Alternância de Tema (Dark / Light) ---');
    const initialTheme = await cdp.eval(`document.documentElement.dataset.theme`);
    console.log(`  * Tema inicial detectado: '${initialTheme}'`);

    // Clicar no botão 'Claro'
    const clickedLight = await cdp.eval(`(() => {
      const btn = [...document.querySelectorAll('main button')].find(b =>
        b.textContent && (b.textContent.includes('Claro') || b.textContent.includes('Light') || b.textContent.includes('claro'))
      );
      if (!btn) return false;
      btn.click();
      return true;
    })()`);

    if (!clickedLight) throw new Error('Botão para mudar tema para Claro não encontrado.');
    await cdp.waitFor(async () => {
      const th = await cdp.eval(`document.documentElement.dataset.theme`);
      return th === 'light';
    }, 5000);
    console.log('  ✓ Tema alterado com sucesso para \'light\'.');

    // Clicar no botão 'Escuro'
    const clickedDark = await cdp.eval(`(() => {
      const btn = [...document.querySelectorAll('main button')].find(b =>
        b.textContent && (b.textContent.includes('Escuro') || b.textContent.includes('Dark') || b.textContent.includes('escuro'))
      );
      if (!btn) return false;
      btn.click();
      return true;
    })()`);

    if (!clickedDark) throw new Error('Botão para mudar tema para Escuro não encontrado.');
    await cdp.waitFor(async () => {
      const th = await cdp.eval(`document.documentElement.dataset.theme`);
      return th === 'dark';
    }, 5000);
    console.log('  ✓ Tema restaurado com sucesso para \'dark\'.');

    // 4. Testar Consulta SQL no DuckDB-Wasm (Sources -> AnalyticsLab)
    console.log('\n--- Testando DuckDB-Wasm SQL Lab ---');
    await cdp.send('Page.navigate', { url: `${baseUrl}?t=sources` });

    // Clicar na sub-aba do Laboratório Analítico SQL
    await cdp.waitFor(async () => {
      return await cdp.eval(`(() => {
        const btn = [...document.querySelectorAll('main button')].find(b =>
          b.textContent && (b.textContent.includes('Laboratório Analítico') || b.textContent.includes('Analytics Lab'))
        );
        if (!btn) return false;
        btn.click();
        return true;
      })()`);
    }, 8000);
    console.log('  * Sub-aba Laboratório Analítico acionada.');

    // Aguardar textarea do console SQL estar visível
    await cdp.waitFor(async () => {
      return await cdp.eval(`!!document.querySelector('main textarea')`);
    }, 15000);

    // Aguardar inicialização do DuckDB
    console.log('  * Aguardando DuckDB-Wasm inicializar na memória...');
    await cdp.waitFor(async () => {
      const status = await cdp.eval(`(() => {
        const text = document.querySelector('main')?.innerText || '';
        if (text.includes('DuckDB indisponível') || text.includes('DuckDB unavailable')) return 'UNAVAILABLE';
        if (text.includes('Inicializando') || text.includes('Initializing')) return false;
        return true;
      })()`);
      if (status === 'UNAVAILABLE') throw new Error('DuckDB-Wasm reportou indisponibilidade na inicialização.');
      return status === true;
    }, 25000);

    // Inserir a query SQL: SELECT COUNT(*) AS total FROM comex_fluxos
    const sqlQuery = 'SELECT COUNT(*) AS total FROM comex_fluxos';
    await cdp.eval(`(() => {
      const textarea = document.querySelector('main textarea');
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
      setter.call(textarea, ${JSON.stringify(sqlQuery)});
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      return textarea.value;
    })()`);

    // Clicar em 'Executar SQL'
    const executed = await cdp.eval(`(() => {
      const btn = [...document.querySelectorAll('main button')].find(b =>
        b.textContent && (b.textContent.includes('Executar SQL') || b.textContent.includes('Run SQL'))
      );
      if (!btn) return false;
      btn.click();
      return true;
    })()`);
    if (!executed) throw new Error('Botão "Executar SQL" não encontrado.');

    console.log(`  * Query executada: "${sqlQuery}"`);

    // Aguardar resultado na tabela correspondente à nova query (coluna 'total')
    await cdp.waitFor(async () => {
      const col = await cdp.eval(`(() => {
        const ths = document.querySelectorAll('main thead th');
        if (ths.length !== 1) return null;
        return ths[0].innerText.trim();
      })()`);
      return col === 'total';
    }, 15000);

    const queryResultVal = await cdp.eval(`(() => {
      const row = document.querySelector('main tbody tr');
      if (!row) return null;
      const cell = row.querySelector('td');
      return cell ? cell.innerText.trim() : null;
    })()`);

    console.log(`  * Resultado obtido da célula: '${queryResultVal}'`);

    if (queryResultVal !== '18') {
      throw new Error(`Resultado inesperado da query: esperado '18', recebido '${queryResultVal}'`);
    }

    console.log('  ✓ Query DuckDB retornou total = 18 com sucesso!');

    console.log('\n🎉 TODOS OS TESTES DE SMOKE PASSARAM COM SUCESSO (100% OK)!');
  } catch (err) {
    console.error('\n❌ Falha no Smoke Test:', err.message);
    process.exitCode = 1;
  } finally {
    if (ws) {
      try { ws.close(); } catch {}
    }
    if (chromeProc) {
      try { chromeProc.kill(); } catch {}
    }
    if (server) {
      try { server.close(); } catch {}
    }
    if (tmpDir && fs.existsSync(tmpDir)) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }
}

runSmoke();
