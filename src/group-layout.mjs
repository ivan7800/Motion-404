/* MOTION-404 5.3 geometric groups and magnetic guides. Pure, browser/server safe. */
const clip=(v,min,max,def=min)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):def};
const txt=(v,max)=>typeof v==='string'?v.slice(0,max):'';
export function normalizePosition(pos){const p=pos&&typeof pos==='object'?pos:{};return {x:clip(p.x,0,1400,20),y:clip(p.y,0,1200,20),width:clip(p.width,90,1000,320),height:clip(p.height,48,900,180)};}
export function normalizeGroup(raw){if(!raw||typeof raw!=='object'||!raw.id)throw Error('Grupo inválido');return {id:txt(raw.id,40),name:txt(raw.name,65)||'Grupo',layout:raw.layout==='free'?'free':'grid',columns:Math.round(clip(raw.columns,1,4,2)),gap:clip(raw.gap,0,64,16),padding:clip(raw.padding,0,80,20),minHeight:clip(raw.minHeight,200,1300,400),radius:clip(raw.radius,0,48,14)};}
export function normalizedGroups(project,blocks){const source=Array.isArray(project?.groups)?project.groups.slice(0,100):[];const ids=[...new Set(blocks.map(b=>b.group).filter(Boolean))];const byId=new Map(source.filter(x=>x&&typeof x.id==='string').map(x=>[x.id,x]));return ids.map(id=>normalizeGroup({...byId.get(id),id}));}
export function ensureContiguous(blocks,ids,groupId){const select=new Set(ids);const members=blocks.filter(b=>select.has(b.id));if(!members.length)return blocks.slice();const insertion=blocks.findIndex(b=>select.has(b.id));const remainder=blocks.filter(b=>!select.has(b.id));const previous=blocks.slice(0,insertion).filter(b=>!select.has(b.id)).length;return [...remainder.slice(0,previous),...members.map(b=>({...b,group:groupId})),...remainder.slice(previous)];}
export function pixelSnapping(rect,others=[],bounds={width:800,height:600},options={}){
 const gap=Number.isFinite(options.grid)?Math.max(1,options.grid):8;
 const magnet=Number.isFinite(options.magnet)?Math.max(0,options.magnet):9;
 const r={x:clip(rect.x,0,Math.max(0,bounds.width-rect.width),0),y:clip(rect.y,0,Math.max(0,bounds.height-rect.height),0),width:rect.width,height:rect.height};
 const suggestions={x:[{target:0,axis:'x',name:'edge-left',strength:1},{target:Math.max(0,bounds.width-r.width),axis:'x',name:'edge-right',strength:1}],y:[{target:0,axis:'y',name:'edge-top',strength:1},{target:Math.max(0,bounds.height-r.height),axis:'y',name:'edge-bottom',strength:1}]};
 for(const other of others){if(!other)continue;for(const target of [other.x,other.x+other.width-r.width,other.x+(other.width-r.width)/2,other.x+other.width,other.x-r.width])suggestions.x.push({target,axis:'x',name:'peer'});for(const target of [other.y,other.y+other.height-r.height,other.y+(other.height-r.height)/2,other.y+other.height,other.y-r.height])suggestions.y.push({target,axis:'y',name:'peer'});}
 const guides=[];
 for(const axis of ['x','y']){const candidate=suggestions[axis].filter(x=>x.target>=0&&x.target<=(axis==='x'?bounds.width-r.width:bounds.height-r.height)).map(x=>({...x,distance:Math.abs(x.target-r[axis])})).sort((a,b)=>a.distance-b.distance)[0];if(candidate&&candidate.distance<=magnet){r[axis]=Math.round(candidate.target);guides.push({axis,at:r[axis],name:candidate.name})}else{r[axis]=Math.round(r[axis]/gap)*gap;}}
 r.x=clip(r.x,0,Math.max(0,bounds.width-r.width));r.y=clip(r.y,0,Math.max(0,bounds.height-r.height));return {...r,guides};
}
export function positionStyle(p){const n=normalizePosition(p);return `left:${n.x}px;top:${n.y}px;width:${n.width}px;min-height:${n.height}px;`;}

/* Keep every group's children together after DnD, undo and backup import. */
export function compactGroups(blocks){const out=[],seen=new Set();for(const b of blocks){if(!b.group){out.push(b);continue}if(seen.has(b.group))continue;seen.add(b.group);out.push(...blocks.filter(x=>x.group===b.group))}return out;}
