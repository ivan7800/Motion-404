/* Library data boundary: shared by storage, backups, previews and exports. */
(function (global) {
  'use strict';
  const presets = {
    original: {label: 'Original', accent: '#a78bfa', speed: 1},
    calm: {label: 'Sereno', accent: '#9adeb8', speed: 0.5},
    vivid: {label: 'Enérgico', accent: '#75d9e8', speed: 1.75},
    cinema: {label: 'Cinemático', accent: '#f2a0ca', speed: 0.75}
  };
  function config(value = {}) {
    value = value && typeof value === 'object' ? value : {};
    return {
      accent: /^#[a-f\d]{6}$/i.test(value.accent) ? value.accent : '#a78bfa',
      speed: Number.isFinite(Number(value.speed)) ? Math.max(0.5, Math.min(2, Number(value.speed))) : 1,
      text: typeof value.text === 'string' ? value.text.slice(0, 140) : 'El umbral permanece abierto.',
      reduced: value.reduced === true
    };
  }
  function collection(value, ids) {
    value = value && typeof value === 'object' ? value : {};
    const allowed = new Set(ids), configs = {};
    for (const [id, settings] of Object.entries(value.configs || {})) {
      if (allowed.has(Number(id))) configs[Number(id)] = config(settings);
    }
    return {saved: [...new Set((Array.isArray(value.saved) ? value.saved : []).filter(id => allowed.has(id)))], configs};
  }
  function importBackup(text, ids) {
    const data = JSON.parse(text);
    if (data?.application !== 'MOTION-404-LIBRARY' || data.version !== 1 || !Array.isArray(data.saved) || !data.configs || typeof data.configs !== 'object' || Array.isArray(data.configs)) {
      throw new Error('Este archivo no es una copia de la biblioteca MOTION-404.');
    }
    return collection(data, ids);
  }
  global.M404_LIBRARY = {presets, config, collection, importBackup};
})(window);
