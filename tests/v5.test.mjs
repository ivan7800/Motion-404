import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('editor v5 exposes redo, layers and clipboard actions',()=>{const s=read('src/editor.js');for(const id of ['m4-redo','m5-layers','m5-copy','m5-paste'])assert.ok(s.includes(id));assert.match(s,/redo\.push\(JSON\.stringify\(project\)\)/);assert.match(s,/redo=\[\]/)});
test('v5 PWA cache bust and assets included',()=>{const s=read('service-worker.js');assert.match(s,/v5\.5-rc1/);assert.match(s,/src\/editor\.js/);assert.match(s,/src\/editor\.css/)});
test('v5 retains source data key and legacy migration',()=>{assert.match(read('src/editor-core.mjs'),/motion404-ultimate-v4-projects/);assert.match(read('src/legacy-migration.mjs'),/motion404-v2-state/)});
