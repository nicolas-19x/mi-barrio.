#!/usr/bin/env node
// Servidor LAN de «Mi Barrio»: entrega el juego y reenvía mensajes entre celulares (WebSocket).
// Sin dependencias: solo Node (16 o más nuevo).  Uso:  node server/server.js  [puerto]
// Opciones de prueba: LAG=80 (ms de retraso artificial)  LOSS=0.05 (pérdida de mensajes 'pos'/'world')
'use strict';
const http=require('http'),crypto=require('crypto'),fs=require('fs'),path=require('path'),os=require('os');
const PORT=+(process.argv[2]||process.env.PORT||8080);
const ROOT=path.resolve(__dirname,'..');
const LAG=+(process.env.LAG||0),LOSS=+(process.env.LOSS||0);
const MAX_PLAYERS=6;
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg','.json':'application/json','.ico':'image/x-icon','.svg':'image/svg+xml'};

// ---------------------------------------------------------------- archivos
const srv=http.createServer((req,res)=>{
  let p=decodeURIComponent((req.url||'/').split('?')[0]);
  if(p==='/'||p==='')p='/Mi_Barrio.html';
  if(p==='/estado'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({salas:[...rooms.values()].map(r=>({code:r.code,players:r.members.length}))}));return}
  const f=path.resolve(ROOT,'.'+p);
  if(!f.startsWith(ROOT+path.sep)||f.includes(path.sep+'.')){res.writeHead(403);res.end();return}
  fs.stat(f,(err,st)=>{
    if(err||!st.isFile()){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('No encontrado');return}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','Content-Length':st.size,'Cache-Control':'no-cache'});
    fs.createReadStream(f).pipe(res)})});

// ---------------------------------------------------------------- WebSocket mínimo (RFC 6455, mensajes de texto)
const GUID='258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
srv.on('upgrade',(req,sock)=>{
  const key=req.headers['sec-websocket-key'];
  if(!key||(req.headers.upgrade||'').toLowerCase()!=='websocket'){sock.destroy();return}
  const acc=crypto.createHash('sha1').update(key+GUID).digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+acc+'\r\n\r\n');
  sock.setNoDelay(true);
  const c=new Client(sock,req.socket.remoteAddress);
  let buf=Buffer.alloc(0),frag=[],fragOp=0;
  sock.on('data',d=>{buf=buf.length?Buffer.concat([buf,d]):d;
    for(;;){
      if(buf.length<2)return;
      const b0=buf[0],b1=buf[1],fin=!!(b0&0x80),op=b0&0x0f,masked=!!(b1&0x80);let len=b1&0x7f,o=2;
      if(len===126){if(buf.length<4)return;len=buf.readUInt16BE(2);o=4}
      else if(len===127){if(buf.length<10)return;len=Number(buf.readBigUInt64BE(2));o=10}
      if(len>1<<20){c.close();return}
      const mo=o;if(masked)o+=4;
      if(buf.length<o+len)return;
      let pl=buf.subarray(o,o+len);
      if(masked){const m=buf.subarray(mo,mo+4);pl=Buffer.from(pl);for(let i=0;i<pl.length;i++)pl[i]^=m[i&3]}
      buf=buf.subarray(o+len);
      if(op===8){c.close();return}
      if(op===9){c.raw(0x8A,pl);continue}
      if(op===10){c.alive=true;continue}
      if(op===0){frag.push(pl);if(fin){const all=Buffer.concat(frag);frag=[];if(fragOp===1)c.onText(all.toString('utf8'))}continue}
      if(op===1){if(fin)c.onText(pl.toString('utf8'));else{fragOp=1;frag=[pl]}continue}
      if(op===2){if(!fin){fragOp=2;frag=[pl]}continue}
    }});
  sock.on('close',()=>c.gone());sock.on('error',()=>c.gone());
});

// ---------------------------------------------------------------- salas
const rooms=new Map();let nextId=1;
const ABC='ABCDEFGHJKLMNPQRSTUVWXYZ';
function newCode(){for(;;){let s='';for(let i=0;i<4;i++)s+=ABC[Math.floor(Math.random()*ABC.length)];if(!rooms.has(s))return s}}
const clean=(s,n)=>String(s==null?'':s).replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,n);
const color=s=>/^#[0-9a-fA-F]{6}$/.test(s)?s:'#d23038';
class Client{
  constructor(sock,ip){this.sock=sock;this.ip=ip;this.id=nextId++;this.room=null;this.name='';this.look={};this.away=false;this.alive=true;this.dead=false;this.joined=Date.now();this.rate=0;this.rateT=Date.now()}
  raw(op,pl){if(this.dead)return;const n=pl.length;let h;
    if(n<126)h=Buffer.from([op,n]);else if(n<65536){h=Buffer.alloc(4);h[0]=op;h[1]=126;h.writeUInt16BE(n,2)}else{h=Buffer.alloc(10);h[0]=op;h[1]=127;h.writeBigUInt64BE(BigInt(n),2)}
    try{this.sock.write(Buffer.concat([h,pl]))}catch(e){}}
  sendStr(s){this.raw(0x81,Buffer.from(s,'utf8'))}
  send(o){this.sendStr(JSON.stringify(o))}
  close(){if(this.dead)return;try{this.raw(0x88,Buffer.alloc(0));this.sock.end()}catch(e){}this.gone()}
  gone(){if(this.dead)return;this.dead=true;try{this.sock.destroy()}catch(e){}leave(this)}
  onText(s){
    const now=Date.now();if(now-this.rateT>1000){this.rateT=now;this.rate=0}if(++this.rate>120)return;   // anti-inundación
    let m;try{m=JSON.parse(s)}catch(e){return}if(!m||typeof m.t!=='string')return;
    handle(this,m,s)}
}
function info(c){return{id:c.id,name:c.name,look:c.look,away:c.away}}
function hostOf(r){return r.members.find(c=>c.id===r.host)}
function pickHost(r){
  const cur=hostOf(r);if(cur&&!cur.away)return;
  const cand=r.members.filter(c=>!c.away).sort((a,b)=>a.joined-b.joined)[0]||r.members.slice().sort((a,b)=>a.joined-b.joined)[0];
  if(!cand||cand.id===r.host)return;
  r.host=cand.id;bcast(r,{t:'host',id:r.host});log(r.code,'anfitrión ahora es',cand.name)}
function bcast(r,o,except){const s=JSON.stringify(o);for(const c of r.members)if(c!==except)c.sendStr(s)}
function relay(r,from,o,lossy){
  if(lossy&&LOSS&&Math.random()<LOSS)return;
  const s=JSON.stringify(o);
  const go=()=>{for(const c of r.members)if(c!==from)c.sendStr(s)};
  if(LAG)setTimeout(go,LAG);else go()}
function enter(c,r){
  c.room=r;r.members.push(c);
  c.send({t:'welcome',id:c.id,room:r.code,host:r.host,players:r.members.filter(x=>x!==c).map(info)});
  bcast(r,{t:'join',p:info(c)},c);
  // el anfitrión manda una foto completa para el recién llegado
  const h=hostOf(r);if(h&&h!==c)h.send({t:'need',id:c.id});
  log(r.code,c.name,'entró ('+r.members.length+')')}
function leave(c){
  const r=c.room;if(!r)return;c.room=null;
  r.members=r.members.filter(x=>x!==c);
  log(r.code,c.name,'salió ('+r.members.length+')');
  if(!r.members.length){rooms.delete(r.code);return}
  bcast(r,{t:'leave',id:c.id});
  if(r.host===c.id){r.host=0;pickHost(r)}}
function handle(c,m,raw){
  const r=c.room;
  switch(m.t){
    case'create':{if(r)leave(c);
      c.name=clean(m.name,16)||'Jugador';c.look={shirt:color(m.look&&m.look.shirt)};
      const code=newCode(),room={code,members:[],host:c.id,created:Date.now()};rooms.set(code,room);enter(c,room);return}
    case'join':{const code=clean(m.room,4).toUpperCase();let room=rooms.get(code);
      if(!room&&m.re&&/^[A-Z]{4}$/.test(code)){   // reconexión tras reiniciar el servidor: se recrea la sala con el mismo código
        if(r)leave(c);c.name=clean(m.name,16)||'Jugador';c.look={shirt:color(m.look&&m.look.shirt)};
        room={code,members:[],host:c.id,created:Date.now()};rooms.set(code,room);enter(c,room);return}
      if(!room){c.send({t:'error',msg:'No existe la sala '+code});return}
      if(room.members.length>=MAX_PLAYERS){c.send({t:'error',msg:'La sala está llena ('+MAX_PLAYERS+' máx.)'});return}
      if(r)leave(c);
      c.name=clean(m.name,16)||'Jugador';c.look={shirt:color(m.look&&m.look.shirt)};
      if(room.members.some(x=>x.name===c.name))c.name=(c.name+' '+c.id).slice(0,16);
      enter(c,room);return}
    case'leave':if(r)leave(c);c.send({t:'left'});return;
    case'ping':c.send({t:'pong',k:m.k});return;
  }
  if(!r)return;
  switch(m.t){
    case'pos':m.id=c.id;relay(r,c,m,true);return;
    case'world':if(c.id!==r.host)return;
      if(m.to){const dst=r.members.find(x=>x.id===m.to);if(dst){delete m.to;dst.send(m)}return}
      relay(r,c,m,!m.full);return;
    case'emote':m.id=c.id;m.k=clean(m.k,8);bcast(r,m,c);return;
    case'chat':m.id=c.id;m.m=clean(m.m,60);if(m.m)bcast(r,m,c);return;
    case'npcTalk':m.id=c.id;m.n=clean(m.n,24);m.on=!!m.on;bcast(r,m,c);return;
    case'away':c.away=!!m.v;bcast(r,{t:'away',id:c.id,v:c.away},c);
      if(c.away&&r.host===c.id)pickHost(r);else if(!c.away)pickHost(r);
      if(!c.away){const h=hostOf(r);if(h&&h!==c)h.send({t:'need',id:c.id})}
      return;
    case'look':c.look={shirt:color(m.look&&m.look.shirt)};bcast(r,{t:'look',id:c.id,look:c.look},c);return;
  }
}
// latido: corta conexiones muertas
setInterval(()=>{for(const r of rooms.values())for(const c of r.members.slice()){if(!c.alive){c.close();continue}c.alive=false;c.raw(0x89,Buffer.alloc(0))}},15000);

function log(...a){console.log(new Date().toLocaleTimeString(),...a)}
function lanIPs(){const out=[];for(const [n,l] of Object.entries(os.networkInterfaces()))for(const a of l||[])if(a.family==='IPv4'&&!a.internal)out.push(a.address);return out}
srv.on('error',e=>{if(e.code==='EADDRINUSE')console.error('El puerto '+PORT+' ya está en uso. Probá: node server/server.js 8081');else console.error(e);process.exit(1)});
srv.listen(PORT,'0.0.0.0',()=>{
  console.log('\n  Mi Barrio · servidor del barrio (LAN)\n');
  const ips=lanIPs();
  if(ips.length){console.log('  Abrí esta dirección en cada celular (misma red wifi):');for(const ip of ips)console.log('     http://'+ip+':'+PORT)}
  else console.log('  No encontré red local. ¿Estás conectado al wifi?');
  console.log('\n  En esta compu: http://localhost:'+PORT);
  if(LAG||LOSS)console.log('  (modo prueba: retraso '+LAG+' ms, pérdida '+LOSS+')');
  console.log('  Ctrl+C para apagar.\n')});
