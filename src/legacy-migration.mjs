/** Safely import v2.0.2 saved Motion Systems; never silently modify legacy storage. */
export const LEGACY_KEY='motion404-v2-state';
export const ULTIMATE_V3_KEY='motion404-ultimate-v3';
const EXP=['Landing page','Aplicación web','Portfolio','E-commerce','Dashboard','Editorial','Experiencia 3D'];
const DNA=['cinematic','minimal','kinetic','editorial','brutal','spatial'];
const PACES=['calm','balanced','fast'],DEPTHS=['flat','layered','spatial'];
const FEATURES=['page-transitions','scroll-story','microinteractions','kinetic-type','cursor-effects','3d-reactive'];
const validSys=s=>{if(!s||typeof s!=='object'||typeof s.id!=='string'||!s.id.startsWith('sys-')||typeof s.project!=='string'||!s.project.trim()||s.project.length>80)return false;const d=s.input,p=s.profile,r=s.risk,qa=s.qa;if(!d||!p||!r||!qa||!Array.isArray(s.timeline)||!Array.isArray(s.recommendations)||typeof s.spec!=='string')return false;if(!EXP.includes(d.experience)||!DNA.includes(d.dna)||!PACES.includes(d.pace)||!DEPTHS.includes(d.depth)||!Number.isInteger(d.intensity)||d.intensity<1||d.intensity>5)return false;if(!Array.isArray(d.features)||d.features.some(v=>!FEATURES.includes(v))||typeof d.context!=='string'||d.context.length>600)return false;if(typeof d.industry!=='string'||typeof d.visual!=='string'||typeof d.stack!=='string'||typeof p.label!=='string'||typeof p.easing!=='string')return false;if(!['perf','cog','a11y','total'].every(k=>Number.isFinite(Number(r[k]))&&Number(r[k])>=0&&Number(r[k])<=100))return false;if(!Number.isFinite(Number(qa.score))||Number(qa.score)<0||Number(qa.score)>100||!Array.isArray(qa.checks))return false;return !!s.created&&!Number.isNaN(Date.parse(s.created));};
export function validateLegacyV2(value){const b=typeof value==='string'?JSON.parse(value):value;if(!b||typeof b!=='object'||Array.isArray(b)||!Array.isArray(b.saved)||b.saved.length>50)throw Error('Backup Motion-404 v2 incompatible');if(b.theme!==undefined&&!['light','dark'].includes(b.theme))throw Error('Tema antiguo inválido');if(!b.saved.every(validSys))throw Error('El backup contiene sistemas inválidos');if(new Set(b.saved.map(x=>x.id)).size!==b.saved.length)throw Error('Sistemas duplicados');return {theme:b.theme==='light'?'light':'dark',saved:b.saved};}
export function mergeLegacyV2(current,incoming){const a=validateLegacyV2(current||{saved:[]}),b=validateLegacyV2(incoming),merged=new Map(a.saved.map(x=>[x.id,x]));let added=0,skipped=0;for(const s of b.saved){if(merged.has(s.id)){skipped++;continue}if(merged.size>=50)throw Error('Límite de 50 sistemas. Exporta un backup antes de reducir la colección.');merged.set(s.id,s);added++;}return {result:{theme:a.theme,saved:[...merged.values()]},added,skipped};}
export function validateV3(value){const b=typeof value==='string'?JSON.parse(value):value;if(!b||b.app!=='motion404-ultimate'||b.version!==3||!b.data||typeof b.data!=='object')throw Error('Backup Ultimate v3 incompatible');for(const key of ['motion','designs','timeline','games','resourceFavorites'])if(!Array.isArray(b.data[key])||b.data[key].length>100)throw Error(`Campo de backup inválido: ${key}`);return b;}
export function classifyBackup(value){const v=typeof value==='string'?JSON.parse(value):value;if(v?.app==='motion404-ultimate')return {type:'ultimate-v3',value:validateV3(v)};if(v?.schema===4&&Array.isArray(v.projects))return {type:'project-v4',value:v};if(v?.schema===4&&Array.isArray(v.blocks))return {type:'project-v4',value:{schema:4,projects:[v],active:v.id}};return {type:'motion-v2',value:validateLegacyV2(v)};}

// Keep every distinct archived entry, including edits that share a historical ID.
export function mergeStudioArchives(...sources) {
  const archives = sources.filter(Boolean).map(validateV3);
  if (!archives.length) return null;
  const data = {};
  for (const key of ['motion', 'designs', 'timeline', 'games', 'resourceFavorites']) {
    const entries = archives.flatMap(archive => archive.data[key]);
    data[key] = [...new Map(entries.map(entry => [JSON.stringify(entry), entry])).values()];
    if (data[key].length > 100) throw Error(`El archivo combinado supera 100 entradas en ${key}.`);
  }
  return {app:'motion404-ultimate', version:3, data};
}
