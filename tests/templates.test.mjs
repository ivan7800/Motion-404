import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../templates/index.html', import.meta.url),'utf8');
const home=readFileSync(new URL('../index.html', import.meta.url),'utf8');
const guide=readFileSync(new URL('../templates/README.md', import.meta.url),'utf8');

test('templates studio is linked from homepage',()=>{
  assert.match(home,/href="\.\/templates\/"/);
  assert.match(html,/id="preview"/);
  assert.match(html,/sandbox="allow-scripts"/);
});

test('all eight vertical templates are present',()=>{
  for(const slug of ['portfolio','ecommerce','dashboard','gaming','restaurante','viajes','automocion','arquitectura']){
    assert.match(html,new RegExp("id:'"+slug+"'"));
  }
});

test('editor includes preview and export controls',()=>{
  for(const id of ['siteName','headline','description','cta','target','mood','colors','mobile','desktop','download','copy']){
    assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
  }
  assert.match(html,/navigator\.clipboard\.writeText/);
  assert.match(html,/URL\.createObjectURL/);
  assert.match(html,/escapeHTML\(m\.headline\)/);
  assert.match(html,/safeHref\(m\.target\)/);
  assert.match(html,/prefers-reduced-motion/);
  assert.match(guide,/imágenes/i);
});

test('inline studio script parses in Node',async()=>{
  const match=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match,'inline script');
  const {Script}=await import('node:vm');
  assert.doesNotThrow(()=>new Script(match[1]));
});
