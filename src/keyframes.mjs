/** Portable, bounded WAAPI timelines; pure functions are shared by editor and exports. */
export const EASINGS=Object.freeze(['linear','ease','ease-in','ease-out','ease-in-out','cubic-bezier(.22,.61,.36,1)','cubic-bezier(.16,1,.3,1)','steps(4,end)']);
const between=(n,lo,hi,fallback)=>{const v=Number(n);return Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):fallback};
export function normalizeKeyframes(list){
 if(!Array.isArray(list))return [];
 const frames=list.slice(0,12).map(v=>({offset:Math.round(between(v?.offset,0,1,0)*100)/100,opacity:Math.round(between(v?.opacity,0,1,1)*100)/100,x:Math.round(between(v?.x,-300,300,0)),y:Math.round(between(v?.y,-300,300,0)),scale:Math.round(between(v?.scale,.1,3,1)*100)/100})).sort((a,b)=>a.offset-b.offset);
 const unique=new Map(frames.map(x=>[x.offset,x]));return [...unique.values()].sort((a,b)=>a.offset-b.offset);
}
export function normalizeEasing(v){return EASINGS.includes(v)?v:'ease-out'}
export function toWAAPI(frames){return normalizeKeyframes(frames).map(f=>({offset:f.offset,opacity:f.opacity,transform:`translate(${f.x}px, ${f.y}px) scale(${f.scale})`}))}
export function interpolate(frames,offset){const f=normalizeKeyframes(frames),t=between(offset,0,1,0);if(!f.length)return {offset:t,opacity:1,x:0,y:0,scale:1};if(t<=f[0].offset)return {...f[0]};if(t>=f.at(-1).offset)return {...f.at(-1)};for(let i=1;i<f.length;i++)if(t<=f[i].offset){const a=f[i-1],b=f[i],ratio=(t-a.offset)/(b.offset-a.offset);return {offset:t,opacity:a.opacity+(b.opacity-a.opacity)*ratio,x:a.x+(b.x-a.x)*ratio,y:a.y+(b.y-a.y)*ratio,scale:a.scale+(b.scale-a.scale)*ratio}}return {...f.at(-1)};}
export function keyframeRuntime(project){const blocks=project.blocks.filter(b=>Array.isArray(b.keyframes)&&b.keyframes.length>=2).map(b=>({id:b.id,frames:toWAAPI(b.keyframes),duration:b.duration,delay:b.delay,easing:normalizeEasing(b.easing)}));return `/* Native Web Animations API · Motion-404 */
const motion404Animations=${JSON.stringify(blocks)};
function motion404Start(root=document){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return [];const running=[];for(const sequence of motion404Animations){const el=Array.from(root.querySelectorAll('[data-motion-id]')).find(x=>x.getAttribute('data-motion-id')===sequence.id);if(!el||typeof el.animate!=='function')continue;running.push(el.animate(sequence.frames,{duration:sequence.duration,delay:sequence.delay,easing:sequence.easing,fill:'both'}));}return running;}
`;}
