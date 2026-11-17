/* Pure adapters: all sources remain immutable. No legacy key is ever written here. */
import {createProject,makeBlock,normalizeProject,PALETTES} from './editor-core.mjs';
const c=(v,min,max,def)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):def));
const effects={cinematic:'reveal',minimal:'fade',kinetic:'scale',editorial:'slide',brutal:'none',spatial:'scale'};
export function fromMotionDNA(input){
 const v=input||{},dna=effects[v.dna]?v.dna:'cinematic',theme={cinematic:'nocturne',minimal:'ivory',kinetic:'cobalt',editorial:'ivory',brutal:'ember',spatial:'abyss'}[dna];
 const p=createProject(typeof v.project==='string'&&v.project.trim()?v.project.trim():'Motion 404',theme),duration=Math.round((v.pace==='fast'?290:v.pace==='calm'?740:490)*(0.7+c(v.intensity,1,5,3)*.1));
 p.blocks=p.blocks.map((b,i)=>({...b,animation:effects[dna],duration,delay:Math.min(1200,i*(v.pace==='fast'?65:115)),accent:PALETTES[theme].accent}));
 p.blocks[1].text=p.name;p.blocks[1].subtext=`Motion DNA ${dna.toUpperCase()} · Intensidad ${c(v.intensity,1,5,3)}/5 · ${v.depth||'layered'}`;
 return normalizeProject(p);
}
export function fromLegacySystem(system){
 if(!system||typeof system!=='object'||typeof system.project!=='string'||!system.input||typeof system.input!=='object')throw Error('Sistema original incompleto');
 const p=fromMotionDNA({...system.input,project:system.project});
 p.blocks.splice(2,0,makeBlock('paragraph',{text:String(system.input.context||'Sistema de movimiento importado desde Motion-404 v2.0.2.').slice(0,180),accent:PALETTES[p.theme].accent}));
 return normalizeProject(p);
}
export function withDesignTokens(project,design){const v=design||{},p=normalizeProject(project);const valid=x=>typeof x==='string'&&/^#[\da-f]{6}$/i.test(x);p.tokens={bg:valid(v.background)?v.background:PALETTES[p.theme].bg,surface:valid(v.surface)?v.surface:PALETTES[p.theme].surface,text:valid(v.text)?v.text:PALETTES[p.theme].text,accent:valid(v.primary)?v.primary:PALETTES[p.theme].accent};p.blocks=p.blocks.map(b=>({...b,accent:p.tokens.accent,radius:c(v.radius,0,50,b.radius)}));return normalizeProject(p)}
export function withTimeline(project,stages){const p=normalizeProject(project);for(let i=0;i<Math.min(3,p.blocks.length);i++){const stage=Array.isArray(stages)?stages[i]:null;if(!stage)continue;p.blocks[i].delay=c(stage.delay,0,10000,0);p.blocks[i].duration=c(stage.duration,0,3000,520)}return normalizeProject(p)}
export function withGameHUD(project,game){const p=normalizeProject(project),v=game||{};const b=makeBlock('hud',{text:typeof v.title==='string'?v.title.slice(0,80):'GAME UI',subtext:typeof v.dialog==='string'?v.dialog.slice(0,260):'',health:c(v.health,0,100,78),sanity:c(v.sanity,0,100,65),accent:PALETTES[p.theme].accent});p.blocks.push(b);return normalizeProject(p)}
