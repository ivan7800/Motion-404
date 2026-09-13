'use strict';
(() => {
  const key='motion404-v2-state';
  try {
    const raw=localStorage.getItem(key);
    if(!raw)return;
    const data=JSON.parse(raw);
    const saved=Array.isArray(data.saved)?data.saved.filter(item=>
      item&&typeof item==='object'&&typeof item.id==='string'&&typeof item.project==='string'&&
      item.input&&typeof item.input==='object'&&Number.isFinite(Number(item.input.intensity))&&
      item.profile&&typeof item.profile==='object'&&typeof item.profile.label==='string'&&
      item.qa&&typeof item.qa==='object'&&Number.isFinite(Number(item.qa.score))&&
      item.risk&&typeof item.risk==='object'&&Array.isArray(item.timeline)&&Array.isArray(item.recommendations)&&
      typeof item.spec==='string'&&item.created&&!Number.isNaN(Date.parse(item.created))
    ).slice(0,50):[];
    localStorage.setItem(key,JSON.stringify({theme:data.theme==='light'?'light':'dark',saved}));
  } catch {
    try { localStorage.removeItem(key); } catch {}
  }
})();