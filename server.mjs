// MOTION-404 HTTP local: servidor sin dependencias, salida legible y puerto alternativo.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const preferred=Number(process.env.PORT||8080);
const openBrowser=process.env.MOTION_OPEN_BROWSER==='1';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  const requested=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const filename=path.resolve(root,'.'+requested);
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  const stat=await fs.stat(filename).catch(()=>null);
  const target=stat?.isDirectory()?path.join(filename,'index.html'):filename;
  const body=await fs.readFile(target);
  const legacyFrame=target===path.join(root,'original-runtime','index.html');
  res.writeHead(200,{'Content-Type':types[path.extname(target).toLowerCase()]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Content-Security-Policy':`default-src 'self' 'unsafe-inline' blob: data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors '${legacyFrame?'self':'none'}'`});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404);res.end('Not found');}
});
function browse(url){
 const p=process.platform;
 const args=p==='win32'?['/c','start','',url]:p==='darwin'?['open',url]:['xdg-open',url];
 const bin=p==='win32'?'cmd':args.shift();
 try{const child=spawn(bin,args,{detached:true,stdio:'ignore',windowsHide:true});child.on('error',()=>console.log('Abre esta direccion manualmente: '+url));child.unref();}
 catch{console.log('Abre esta direccion manualmente: '+url);}
}
server.on('error',err=>{
 if(err.code==='EADDRINUSE'&&preferred!==0){console.warn(`Puerto ${preferred} ocupado. Buscando otro libre...`);server.listen(0,'127.0.0.1');}
 else{console.error('No se puede iniciar el servidor:',err.message);process.exitCode=1;}
});
server.on('listening',()=>{
 const port=server.address().port;const url=`http://127.0.0.1:${port}/`;
 console.log(`MOTION-404 ULTIMATE STUDIO — LISTO\n${url}\nPara cerrar: Ctrl+C`);
 if(openBrowser)browse(url);
});
if(!Number.isInteger(preferred)||preferred<0||preferred>65535){console.error('Puerto invalido');process.exit(1);}
server.listen(preferred,'127.0.0.1');
