import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context = {window: {}};
vm.runInNewContext(readFileSync(new URL('../src/library-model.js', import.meta.url), 'utf8'), context);
const model = context.window.M404_LIBRARY;
const plain = x => JSON.parse(JSON.stringify(x));
test('library restores valid favorites and retains customized text without accepting CSS injection', () => {
  const state = model.collection({saved: [1, 1, 85, 999, '2'], configs: {1: {accent: 'red; background:url(x)', speed: 90, text: '<script>literal text</script>'}, 999: {}}}, [1, 2, 85]);
  assert.deepEqual(plain(state.saved), [1, 85]);
  assert.equal(state.configs[1].accent, '#a78bfa');
  assert.equal(state.configs[1].speed, 2);
  assert.equal(state.configs[1].text, '<script>literal text</script>');
  assert.equal(state.configs[999], undefined);
});
test('library backup validates format before import, round trips adjustments and supports an empty text', () => {
  const source = {application: 'MOTION-404-LIBRARY', version: 1, saved: [85], configs: {85: {text: '', accent: '#75d9e8', speed: 0.75, reduced: true}}};
  const restored = model.importBackup(JSON.stringify(source), [85]);
  assert.deepEqual(plain(restored), {saved: source.saved, configs: source.configs});
  for (const bad of ['null', '{}', '{', JSON.stringify({...source, version: 2}), JSON.stringify({...source, configs: []})]) {
    assert.throws(() => model.importBackup(bad, [85]));
  }
});
test('corrupt or missing local data falls back to usable defaults', () => {
  assert.deepEqual(plain(model.collection(null, [1])), {saved: [], configs: {}});
  assert.equal(model.config({speed: 'broken'}).speed, 1);
  assert.equal(model.config({text: 'x'.repeat(500)}).text.length, 140);
  assert.equal(model.config(null).reduced, false);
});

// Regression: imported and composed patterns must survive normalization and export.
import {makeBlock, normalizeProject, projectJS} from '../src/editor-core.mjs';
test('all six new IDs survive project normalization and export', () => {
  const blocks = Array.from({length: 6}, (_, i) => makeBlock('pattern', {patternId: 85 + i}));
  const project = normalizeProject({schema: 4, blocks});
  assert.deepEqual(project.blocks.map(b => b.patternId), [85, 86, 87, 88, 89, 90]);
  for (const id of [85, 86, 87, 88, 89, 90]) assert.ok(projectJS(project).includes(`,${id},`));
});
