// Teste matematico do voo 3D (v4 FINAL): para TODAS as paradas,
// partindo de orientacoes e cameras aleatorias (limites reais do app):
//  1) destino exato: ponto final encara a camera (ang < 0.5)
//  2) zero roll: tangente do meridiano sem componente lateral (|dot| ~ 0)
//  3) nunca invertido: componente "up" do meridiano >= 0
import * as THREE from 'three';
import fs from 'node:fs';

function latLngToVec3(lng, lat, radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function uprightQuat(pLocal, target, fallback) {
  const up = new THREE.Vector3(0, 1, 0);
  const zL = pLocal.clone().normalize();
  const xL = new THREE.Vector3().crossVectors(up, zL);
  if (xL.lengthSq() < 1e-6) return fallback.clone();
  xL.normalize();
  const yL = new THREE.Vector3().crossVectors(zL, xL);
  const zW = target.clone().normalize();
  const xW = new THREE.Vector3().crossVectors(up, zW);
  if (xW.lengthSq() < 1e-6) xW.set(1, 0, 0);
  else xW.normalize();
  const yW = new THREE.Vector3().crossVectors(zW, xW);
  const mL = new THREE.Matrix4().makeBasis(xL, yL, zL);
  const mW = new THREE.Matrix4().makeBasis(xW, yW, zW);
  return new THREE.Quaternion().setFromRotationMatrix(mW)
    .multiply(new THREE.Quaternion().setFromRotationMatrix(mL).invert());
}

function flightNew(lng, lat, lift, q0, camPos) {
  const p = latLngToVec3(lng, lat, 1);
  const camDir = camPos.clone().normalize();
  const l = Math.min(1, Math.max(0, lift ?? 0));
  if (l > 0) {
    const up = new THREE.Vector3(0, 1, 0);
    const perp = up.addScaledVector(camDir, -up.dot(camDir));
    if (perp.lengthSq() > 1e-6) {
      perp.normalize();
      const th = l * 0.45;
      camDir.multiplyScalar(Math.cos(th)).addScaledVector(perp, Math.sin(th)).normalize();
    }
  }
  const to = uprightQuat(p, camDir, q0);
  return { to, PointLocal: p, target: camDir, camDir0: camPos.clone().normalize() };
}

const tourSrc = fs.readFileSync('src/data/tour.ts', 'utf8');
const toursSrc = fs.readFileSync('src/data/tours.ts', 'utf8');
const stops = [];
for (const m of tourSrc.matchAll(/id: '([a-z0-9-]+)',\s*\n\s*chapter:/g))
  stops.push({ id: m[1] });
for (const m of toursSrc.matchAll(/id: '([a-z0-9-]+)', chapter:/g))
  stops.push({ id: m[1] });
function coordsOf(src, id) {
  const i = src.indexOf(`id: '${id}'`);
  if (i < 0) return null;
  const m = src.slice(i, i + 600).match(/lng: (-?[\d.]+), lat: (-?[\d.]+)/);
  return m ? { lng: +m[1], lat: +m[2] } : null;
}
const full = [];
for (const s of stops) {
  const c = coordsOf(tourSrc, s.id) || coordsOf(toursSrc, s.id);
  if (c) full.push({ ...s, ...c });
}
console.log('paradas testadas:', full.length);

function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry(7);
const randQuat = () => new THREE.Quaternion().setFromEuler(
  new THREE.Euler(rnd() * Math.PI * 2, rnd() * Math.PI * 2, rnd() * Math.PI * 2));
const randCam = () => {
  const polar = 0.2 + rnd() * (Math.PI - 0.4);
  const az = rnd() * Math.PI * 2;
  const r = 1.55 + rnd() * (5 - 1.55);
  return new THREE.Vector3(
    r * Math.sin(polar) * Math.cos(az),
    r * Math.cos(polar),
    r * Math.sin(polar) * Math.sin(az));
};

const UP = new THREE.Vector3(0, 1, 0);
let pass = 0, fail = 0, maxRoll = 0, minUp = 1;
const TRIALS = 8;
for (const s of full) {
  for (let k = 0; k < TRIALS; k++) {
    const q0 = randQuat();
    const cam = randCam();
    const n = flightNew(s.lng, s.lat, 0.55, q0, cam);
    const finalW = n.PointLocal.clone().applyQuaternion(n.to).normalize();
    const ang = finalW.angleTo(n.target) * 180 / Math.PI;
    // tangente local rumo ao norte
    const zL = n.PointLocal.clone().normalize();
    const t = UP.clone().addScaledVector(zL, -UP.dot(zL));
    let roll = 0, upness = 1;
    if (t.lengthSq() > 1e-6) {
      t.normalize().applyQuaternion(n.to);
      // screen-right da camera final ~= perp(up, target)
      const sr = new THREE.Vector3().crossVectors(n.target, UP);
      if (sr.lengthSq() > 1e-6) { sr.normalize(); roll = Math.abs(t.dot(sr)); }
      upness = t.dot(UP);
    }
    if (roll > maxRoll) maxRoll = roll;
    if (upness < minUp) minUp = upness;
    if (ang < 0.5 && roll < 1e-4 && upness > -1e-6) pass++;
    else { fail++; console.log(`FALHA: ${s.id} ang=${ang.toFixed(3)} roll=${roll.toExponential(1)} up=${upness.toFixed(3)}`); }
  }
}
console.log(`\nRESULTADO: ${pass} ok, ${fail} falhas em ${full.length * TRIALS} voos | maxRoll=${maxRoll.toExponential(1)} minUp=${minUp.toFixed(3)}`);
if (fail > 0) process.exit(1);
console.log('GARANTIA: destino exato + zero roll + nunca invertido.');
