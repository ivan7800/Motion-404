import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {validateLegacyV2,mergeLegacyV2} from '../src/legacy-migration.mjs';

const context=vm.createContext({Date,Math});
vm.runInContext(readFileSync(new URL('../src/motion-v2-core.js',import.meta.url),'utf8'),context);
const core=context.M404_V2_CORE;
const sample={project:'Prueba integración Motion v2',experience:'Landing page',industry:'Videojuegos',stack:'HTML + CSS + JS',visual:'Lujo monocromo',dna:'cinematic',pace:'balanced',depth:'layered',intensity:3,features:['page-transitions','microinteractions'],context:'Proyecto de auditoría'};

test('v5.3 shared v2 core exposes exact original 180 deterministic IDs',()=>{
 assert.equal(core.version,'2.0.2');assert.equal(core.presets.length,180);
 assert.deepEqual([...new Set(core.presets.map(p=>p.id))].length,180);
 assert.equal(core.presets[0].id,'m404-001');assert.equal(core.presets[179].id,'m404-180');
 assert.equal(core.presets[0].title,'Atlas Habitat');assert.equal(core.presets[30].title,'Atlas Habitat Flow');
});
test('v5.3 shared core retains all six legacy profile features',()=>{
 assert.deepEqual(Object.keys(core.profiles).sort(),['brutal','cinematic','editorial','kinetic','minimal','spatial']);
 for(const p of Object.values(core.profiles))for(const key of ['label','easing','duration','stagger','character','enter','hover','scroll','avoid'])assert.ok(p[key]);
});
test('v5.3 actual v2 generator supplies all legacy data and a complete spec',()=>{
 const sys=core.generateSystem(sample);
 assert.equal(sys.project,sample.project);assert.ok(sys.id.startsWith('sys-'));assert.ok(sys.created);
 assert.equal(sys.input.dna,'cinematic');assert.equal(sys.profile.key,'cinematic');
 assert.ok(sys.timeline.length>=5);assert.equal(sys.qa.checks.length,9);
 assert.ok(sys.qa.score<=100&&sys.qa.score>=55);
 for(let n=1;n<=11;n++)assert.ok(sys.spec.includes(`## ${n}. `),`Sección ${n} missing`);
 assert.match(sys.spec,/MOTION DNA/);assert.match(sys.spec,/prefers-reduced-motion/);
 const restored=validateLegacyV2({app:'Motion 404',version:'2.0.2',saved:[sys]});assert.equal(restored.saved.length,1);
});
test('v5.3 v2 risk faithfully reproduces low/medium/high boundaries',()=>{
 const d=core.cleanInput(sample);const r=core.riskFrom(d);
 assert.equal(r.perf,40);assert.equal(r.cog,21);assert.equal(r.a11y,12);assert.equal(r.total,27);
 assert.equal(core.recommendations(d,r).at(-1),'Implementa siempre prefers-reduced-motion con una experiencia equivalente.');
 const extreme={...d,intensity:5,depth:'spatial',stack:'Three.js + GSAP',features:['3d-reactive','cursor-effects','kinetic-type','scroll-story','page-transitions','microinteractions'],pace:'fast'};
 const high=core.riskFrom(extreme);assert.ok(high.total>=65);assert.ok(high.perf<=100);assert.ok(high.cog<=100);
});
test('v5.3 timeline sections are ordered and limited to nonblocking transitions',()=>{
 const sys=core.generateSystem(sample);
 for(let i=1;i<sys.timeline.length;i++)assert.ok(sys.timeline[i].time>sys.timeline[i-1].time);
 assert.ok(sys.timeline.some(x=>x.name==='Primary CTA feedback'));
 assert.ok(sys.timeline.some(x=>x.name==='Page transition'));
});
test('v5.3 legacy backups merge without deleting existing data or changing their ids',()=>{
 const a=core.generateSystem(sample),b=core.generateSystem({...sample,project:'Segundo'});
 const old={theme:'light',saved:[a]},incoming={theme:'dark',saved:[a,b]};
 const r=mergeLegacyV2(old,incoming);
 assert.equal(r.added,1);assert.equal(r.skipped,1);
 assert.equal(r.result.theme,'light');assert.equal(r.result.saved.length,2);
 assert.deepEqual(r.result.saved.map(x=>x.id),[a.id,b.id]);
 assert.equal(old.saved.length,1);
});
test('v5.3 old JSON with tampered risk, duplicate ids or invalid feature is rejected',()=>{
 const sys=core.generateSystem(sample);
 assert.throws(()=>validateLegacyV2({saved:[sys,{...sys}]}),/duplicados/i);
 assert.throws(()=>validateLegacyV2({saved:[{...sys,input:{...sys.input,features:['unknown']}}]}),/inválidos/i);
 assert.throws(()=>validateLegacyV2({saved:[{...sys,risk:{...sys.risk,total:300}}]}),/inválidos/i);
});
