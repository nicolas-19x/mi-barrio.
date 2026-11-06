// ================= MIRADOR: CONTROLES DISCRETOS =================
// Los botones viven dentro de la tarjeta del título (arriba, sobre el cielo) y todo se atenúa si no tocás nada.
(function(){const v=$('#vista');if(!v)return;const cap=v.querySelector('.vcap'),btns=v.querySelector('.vbtns');if(!cap||!btns||cap.querySelector('.vbtns'))return;
  const txt=document.createElement('div');txt.className='vtxt';while(cap.firstChild)txt.appendChild(cap.firstChild);cap.appendChild(txt);cap.appendChild(btns);
  const w=$('#vWait');if(w){w.innerHTML='⏳ <span>+1 h</span>';w.title='Esperar una hora (T)';w.setAttribute('aria-label','Esperar una hora')}
  const back=btns.querySelector('[data-a="closeVista"]');if(back){back.innerHTML='✕ <span>Volver</span>';back.title='Volver (Esc)';back.setAttribute('aria-label','Volver')}
  const st=document.createElement('style');st.textContent=`
#vista .vcap{flex-direction:row;align-items:center;gap:12px;padding:6px 6px 6px 14px;pointer-events:auto;max-width:calc(100vw - 24px);transition:opacity .6s ease,transform .6s ease}
#vista .vcap .vtxt{display:flex;flex-direction:column;align-items:flex-start;text-align:left;min-width:0}
#vista .vcap .vtxt b{font-size:15px;white-space:nowrap}
#vista .vcap .vtxt span{font-size:11.5px;white-space:nowrap}
#vista .vcap .vbtns{position:static;transform:none;left:auto;bottom:auto;display:flex;gap:6px;flex-wrap:nowrap}
#vista .vcap button{padding:6px 10px;min-height:0;font-size:13px;line-height:1.1;border-radius:9px;white-space:nowrap}
#vista.vdim .vcap{opacity:.22;transform:translateX(-50%) translateY(-4px)}
#vista.vdim .vcap:hover{opacity:1}
@media (max-width:420px){#vista .vcap{gap:8px;padding:5px 5px 5px 11px}#vista .vcap .vtxt b{font-size:13.5px}#vista .vcap .vtxt span{font-size:10.5px}#vista .vcap button{padding:6px 8px}#vista .vcap button span{display:none}}`;document.head.appendChild(st);
  let tm=0;const wake=()=>{v.classList.remove('vdim');clearTimeout(tm);tm=setTimeout(()=>{if(VISTA)v.classList.add('vdim')},3500)};
  for(const ev of['pointerdown','pointermove','keydown','touchstart'])(ev==='keydown'?document:v).addEventListener(ev,()=>{if(VISTA)wake()},{passive:true});
  hookAfter('openVista',wake);
  hookBefore('closeVista',function(){clearTimeout(tm);v.classList.remove('vdim')})})();
