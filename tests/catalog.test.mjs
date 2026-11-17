import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const load=async(file)=>readFile(path.join(root,file),'utf8');
async function context(){const g={window:{}};vm.createContext(g);vm.runInContext(await load('src/catalog.js'),g);vm.runInContext(await load('src/components.js'),g);return g.window}

test('el catálogo contiene exactamente 84 entradas originales',async()=>{
 const w=await context();assert.equal(w.M404_CATALOG.length,84);assert.deepEqual([...new Set(w.M404_CATALOG.map(c=>c.id))].length,84);
 assert.equal(JSON.stringify(w.M404_CATALOG.map(c=>c.id)),JSON.stringify(Array.from({length:84},(_,i)=>i+1)));
 assert.equal(w.M404_CATALOG.filter(c=>c.provider==='DesignBookmark').length,53);
 assert.equal(w.M404_CATALOG.filter(c=>c.provider==='Kokonut UI').length,25);
 assert.equal(w.M404_CATALOG.filter(c=>c.provider==='SmoothUI').length,6);
});
test('los 84 componentes generan HTML diferenciado sin excepciones',async()=>{
 const w=await context();const s={on:false,done:false,open:false,step:0,tab:0,range:35,number:2,text:'',items:[],tags:['motion','404'],checks:[false,true,false,false],rating:0,cart:0,loading:false};
 const seen=new Set();for(const item of w.M404_CATALOG){const render=w.M404_DEMOS[item.id];assert.equal(typeof render,'function',`Falta renderizador #${item.id}`);const markup=render({...s}, {text:'Texto de prueba <script>alert(1)</script>',accent:'#a78bfa',speed:1});assert.equal(typeof markup,'string');assert.ok(markup.length>75,`Demo vacía #${item.id}`);assert.ok(markup.includes('class='),`HTML inválido #${item.id}`);seen.add(markup)}assert.equal(seen.size,84,'Debe haber 84 demostraciones diferentes');
});
test('metadatos de procedencia, categorías y links están presentes',async()=>{const w=await context();const cats=new Set(['Buttons','Inputs','Navigation','Cards','AI','Text']);for(const c of w.M404_CATALOG){assert.ok(cats.has(c.category),c.name);assert.ok(/^https:\/\//.test(c.reference),c.name);assert.ok(c.slug.length>1);assert.ok(c.origin.includes('original'))}});
test('el código del paquete no usa librerías ni conexiones externas',async()=>{const pkg=JSON.parse(await load('package.json'));assert.deepEqual(pkg.dependencies,{});assert.deepEqual(pkg.devDependencies,{});const html=await load('index.html');assert.ok(!html.includes('https://cdn.'));assert.match(html,/src\/engine.js/);assert.match(html,/src\/components.js/)});
test('el exportador incluye las últimas versiones completas de motor y CSS',async()=>{const p=await load('src/export-payload.js');const g={window:{}};vm.createContext(g);vm.runInContext(p,g);for(const [key,filename] of [['engine','engine.js'],['components','components.js'],['css','style.css']])assert.equal(g.window.M404_EXPORT[key],await load('src/'+filename))});
test('PWA cachea todos los recursos de arranque',async()=>{const sw=await load('service-worker.js');for(const x of ['src/catalog.js','src/components.js','src/engine.js','src/app.js','src/export-payload.js','src/style.css'])assert.ok(sw.includes(x),x)});
