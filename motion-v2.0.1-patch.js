'use strict';
const RELEASE_VERSION='2.0.1';
const RELEASE_FEATURES=['page-transitions','scroll-story','microinteractions','kinetic-type','cursor-effects','3d-reactive'];

function releaseValidSaved(item){
  if(!item||typeof item!=='object'||typeof item.id!=='string'||!/^sys-[a-zA-Z0-9._:-]+$/.test(item.id))return false;
  if(typeof item.project!=='string'||!item.project.trim()||item.project.length>80)return false;
  if(!item.input||typeof item.input!=='object'||!item.profile||typeof item.profile!=='object'||!item.risk||typeof item.risk!=='object'||!item.qa||typeof item.qa!=='object')return false;
  const d=item.input,p=item.profile,r=item.risk;
  if(!experiences.includes(d.experience)||!industries.includes(d.industry)||!stacks.includes(d.stack)||!visuals.includes(d.visual)||!dnaKeys.includes(d.dna))return false;
  if(!['calm','balanced','fast'].includes(d.pace)||!['flat','layered','spatial'].includes(d.depth)||!Number.isInteger(d.intensity)||d.intensity<1||d.intensity>5)return false;
  if(!Array.isArray(d.features)||d.features.some(v=>!RELEASE_FEATURES.includes(v))||typeof d.context!=='string'||d.context.length>600)return false;
  if(typeof p.label!=='string'||typeof p.character!=='string'||typeof p.easing!=='string'||typeof p.duration!=='string'||typeof p.stagger!=='string'||typeof p.enter!=='string'||typeof p.hover!=='string'||typeof p.scroll!=='string'||typeof p.avoid!=='string')return false;
  if(!['perf','cog','a11y','total'].every(k=>Number.isFinite(Number(r[k]))&&Number(r[k])>=0&&Number(r[k])<=100))return false;
  if(typeof item.spec!=='string'||!item.spec.trim()||item.spec.length>200000)return false;
  if(!Array.isArray(item.recommendations)||item.recommendations.some(v=>typeof v!=='string'||v.length>1000))return false;
  if(!Array.isArray(item.timeline)||item.timeline.some(x=>!x||typeof x!=='object'||typeof x.name!=='string'||typeof x.detail!=='string'||!Number.isFinite(Number(x.time))||!Number.isFinite(Number(x.duration))))return false;
  if(!Array.isArray(item.qa.checks)||item.qa.checks.some(x=>!x||typeof x!=='object'||!['pass','warn'].includes(x.status)||typeof x.title!=='string'||typeof x.detail!=='string'))return false;
  if(!Number.isFinite(Number(item.qa.score))||Number(item.qa.score)<0||Number(item.qa.score)>100)return false;
  return Boolean(item.created&&!Number.isNaN(Date.parse(item.created)));
}
validSaved=releaseValidSaved;

const releaseBuildSpec=buildSpec;
buildSpec=function(...args){return releaseBuildSpec(...args).replace(`Motion 404 v${VERSION}`,`Motion 404 v${RELEASE_VERSION}`)};
generateSystem=function(d){if(!d.project)return null;const profile=DNA_PROFILES[d.dna]||DNA_PROFILES.minimal;const r=riskFrom(d),recs=recommendations(d,r);const timeline=buildTimeline(d,profile);const qa=buildQa(d,r);const spec=buildSpec(d,profile,r,recs,timeline,qa);return{id:`sys-${Date.now()}`,created:new Date().toISOString(),project:d.project,input:d,profile:{key:d.dna,...profile},risk:r,recommendations:recs,timeline,qa,spec,output:{spec}}};

const releaseRenderSystem=renderSystem;
renderSystem=function(sys){
  if(sys&&sys.input){
    const d=sys.input;
    $('#projectInput').value=d.project||sys.project||'';$('#experienceSelect').value=d.experience;$('#industrySelect').value=d.industry;$('#stackSelect').value=d.stack;$('#visualSelect').value=d.visual;$('#dnaSelect').value=d.dna;$('#paceSelect').value=d.pace;$('#depthSelect').value=d.depth;el.intensity.value=d.intensity;el.intensityOut.textContent=`${d.intensity} / 5`;
    $$('input[name="features"]',el.form).forEach(b=>b.checked=d.features.includes(b.value));const ctx=$('textarea[name="context"]',el.form);if(ctx)ctx.value=d.context||'';updateInspector();
  }
  return releaseRenderSystem(sys);
};

importSystems=function(file){
  if(!file||file.size>MAX_IMPORT_BYTES){toast('JSON no válido o demasiado grande.');return}
  const reader=new FileReader();
  reader.onerror=()=>toast('No se pudo leer el archivo.');
  reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(data.app!=='Motion 404'||!String(data.version||'').startsWith('2.')||!Array.isArray(data.saved))throw new Error();const safe=data.saved.filter(releaseValidSaved).slice(0,MAX_SAVED);if(data.saved.length&&safe.length===0)throw new Error();persisted.saved=safe;saveState();renderSaved();toast(`${safe.length} sistemas importados.`)}catch{toast('El archivo no es una copia válida de Motion 404 v2.')}};
  reader.readAsText(file);
};

function releaseExportSystems(){const payload={app:'Motion 404',version:RELEASE_VERSION,exportedAt:new Date().toISOString(),saved:persisted.saved};download(`motion-404-v2-systems-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),'application/json');toast('Sistemas exportados.')}
const exportButton=document.querySelector('#exportSystems');
if(exportButton){const replacement=exportButton.cloneNode(true);exportButton.replaceWith(replacement);replacement.addEventListener('click',releaseExportSystems)}

persisted.saved=persisted.saved.filter(releaseValidSaved).slice(0,MAX_SAVED);saveState();renderSaved();
if('serviceWorker' in navigator){const register=()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Service Worker no disponible:',err));if(document.readyState==='complete')register();else window.addEventListener('load',register,{once:true})}
console.info(`Motion 404 v${RELEASE_VERSION} · QA/Premium patch activo`);