// Teste de ENQUADRAMENTO das rotas (2D->3D): valida que
//  1) o ponto medio de uma rota e calculado no espaco 3D (atravessa o
//     antimeridiano) e nao pela media aritmetica de longitude (bug antigo);
//  2) a distancia automatica da camera mantem as DUAS pontas da rota
//     dentro do frustum (FOV vertical + aspect).
import * as THREE from 'three';
import fs from 'node:fs';

function latLngToVec3(lng, lat, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

// mesma formula do app (world.ts: routeMidpoint)
function routeMidpoint(a, b) {
  const va = latLngToVec3(a[0], a[1]);
  const vb = latLngToVec3(b[0], b[1]);
  const v = va.clone().add(vb);
  if (v.lengthSq() < 1e-6) return a;
  v.normalize();
  const lat = 90 - (Math.acos(THREE.MathUtils.clamp(v.y, -1, 1)) * 180) / Math.PI;
  let lng = (Math.atan2(v.z, -v.x) * 180) / Math.PI - 180;
  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;
  return [lng, lat];
}
// formula ANTIGA (bug): media aritmetica de longitude
const oldMid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// assinatura de distancia do app (Globe3DCanvas autoDist):
// 25% de folga no frame (rota ocupa ~80% da tela) e minimo 2.0 (fluxos curtos
// nao colam a camera no pais)
function autoDist(spanRad, fovDeg, aspect) {
  const halfV = (fovDeg * Math.PI) / 360;
  const halfH = Math.atan(Math.tan(halfV) * Math.max(1, aspect));
  const half = Math.min(halfV, halfH);
  const fit = spanRad / 2 / Math.max(0.08, half);
  return Math.min(5, Math.max(2.0, 1.42 / Math.cos(Math.min(1.35, fit)) / 0.8));
}

const worldSrc = fs.readFileSync('src/lib/world.ts', 'utf8');
const flowsSrc = fs.readFileSync('src/data/flows.ts', 'utf8');

// anchors dos blocos: { id: 'usa', ... anchor: [-99, 39] }
const anchors = {};
for (const m of worldSrc.matchAll(/id: '([a-z0-9]+)', code: '[A-Z]+', color: '#[0-9a-f]+', anchor: \[(-?[\d.]+), (-?[\d.]+)\]/g)) {
  anchors[m[1]] = [+m[2], +m[3]];
}
console.log('blocos com anchor:', Object.keys(anchors).length);

// fluxos: pega cada id e o trecho from/to
const flows = [];
const re = /id: '([a-z0-9-]+)',(?: tier: '[a-z]+',)? type: '[a-z]+', from: ('(?:[a-z0-9]+)'|\[[-\d.,\s]+\]), to: ('(?:[a-z0-9]+)'|\[[-\d.,\s]+\])/g;
for (const m of flowsSrc.matchAll(re)) {
  const parse = (s) => s.startsWith("'") ? anchors[s.slice(1, -1)] : s.slice(1, -1).split(',').map(Number);
  const from = parse(m[2]);
  const to = parse(m[3]);
  if (from && to) flows.push({ id: m[1], from, to });
}
console.log('fluxos testados:', flows.length);

let fail = 0;
let antimeridian = 0;
for (const f of flows) {
  const va = latLngToVec3(f.from[0], f.from[1]);
  const vb = latLngToVec3(f.to[0], f.to[1]);
  const span = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1));
  const newMid = routeMidpoint(f.from, f.to);
  const vm = latLngToVec3(newMid[0], newMid[1]);
  // equidistante das pontas?
  const dA = vm.angleTo(va);
  const dB = vm.angleTo(vb);
  const eq = Math.abs(dA - dB);
  // o ponto medio deve estar perto do arco (soma dos angulos ~ span)
  const along = dA + dB;
  const old = oldMid(f.from, f.to);
  const vOld = latLngToVec3(old[0], old[1]);
  const oldErr = Math.max(vOld.angleTo(va), vOld.angleTo(vb));
  const newErr = Math.max(vm.angleTo(va), vm.angleTo(vb));
  const closer = newErr <= oldErr + 1e-6;
  if (Math.abs(f.from[0] - f.to[0]) > 180) antimeridian++;
  const ok = eq < 1e-6 && Math.abs(along - span) < 1e-6 && closer;
  if (!ok) {
    fail++;
    console.log(`FALHA mid: ${f.id} eq=${eq.toExponential(1)} along=${along.toFixed(3)} span=${span.toFixed(3)} newErr=${newErr.toFixed(3)} oldErr=${oldErr.toFixed(3)}`);
  }
}

// enquadramento: para cada rota, ambos endpoints dentro do frustum na dist calculada
const FOV = 42, ASPECT = 16 / 9;
let frameFail = 0;
for (const f of flows) {
  const va = latLngToVec3(f.from[0], f.from[1]);
  const vb = latLngToVec3(f.to[0], f.to[1]);
  const span = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1));
  const dist = autoDist(span, FOV, ASPECT);
  const cam = routeMidpoint(f.from, f.to);
  const camPos = latLngToVec3(cam[0], cam[1], dist);
  const camDir = camPos.clone().normalize();
  const forward = camDir.clone().negate();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(forward, up).normalize();
  const camUp = new THREE.Vector3().crossVectors(right, forward).normalize();
  const halfV = Math.tan((FOV * Math.PI) / 360);
  const halfH = halfV * ASPECT;
  let inside = true;
  for (const p of [va.clone(), vb.clone()]) {
    const rel = p.sub(camPos);
    const z = rel.dot(forward);
    if (z <= 0) { inside = false; break; }
    const x = rel.dot(right) / z;
    const y = rel.dot(camUp) / z;
    if (Math.abs(x) > halfH * 1.05 || Math.abs(y) > halfV * 1.05) inside = false;
  }
  if (!inside) {
    frameFail++;
    console.log(`FORA DO FRUSTUM: ${f.id} span=${((span * 180) / Math.PI).toFixed(1)}° dist=${dist.toFixed(2)}`);
  }
}

console.log(`\nrotas cross-antimeridiano: ${antimeridian}`);
console.log(`ponto medio: ${flows.length - fail}/${flows.length} ok`);
console.log(`enquadramento: ${flows.length - frameFail}/${flows.length} ok`);
if (fail > 0 || frameFail > 0) process.exit(1);
console.log('GARANTIA: ponto medio 3D (sem bug de longitude) + rotas dentro do frustum.');
