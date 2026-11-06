const fs=require('fs'),acorn=require('acorn'),walk=require('acorn-walk');
function strings(file){const src=fs.readFileSync(file,'utf8'),ast=acorn.parse(src,{ecmaVersion:'latest'}),m=new Map();const add=v=>{if(typeof v!=='string'||v.length<2)return;m.set(v,(m.get(v)||0)+1)};
  walk.simple(ast,{Literal(n){add(n.value)},TemplateLiteral(n){for(const q of n.quasis)add(q.value.cooked)}});return m}
const A=strings(process.argv[2]),B=strings(process.argv[3]),texty=s=>/[A-Za-zÁÉÍÓÚáéíóúñÑ]{3,}[ ,.!?¿¡…]+[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}/.test(s);
let tot=0,totT=0,missing=[],fewer=[];for(const[s,c]of A){tot+=c;if(texty(s))totT+=c;const d=B.get(s)||0;if(d===0)missing.push([s,c]);else if(d<c)fewer.push([s,c,d])}
let added=[];for(const[s,c]of B)if(!A.has(s))added.push(s);
console.log('textos en el original:',tot,'(con frases:',totT+')','| en el nuevo:',[...B.values()].reduce((a,b)=>a+b,0));
const mt=missing.filter(([s])=>texty(s));console.log('desaparecen',missing.length,'cadenas; con frases:',mt.length);for(const[s]of mt)console.log('  −',JSON.stringify(s).slice(0,140));
console.log('aparecen menos veces:',fewer.filter(([s])=>texty(s)).length);for(const[s,c,d]of fewer.filter(([s])=>texty(s)))console.log('  ~',c,'→',d,JSON.stringify(s).slice(0,120));
console.log('cadenas nuevas:',added.length);for(const s of added.filter(texty))console.log('  +',JSON.stringify(s).slice(0,120));
