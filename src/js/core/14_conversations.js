// ================= CONVERSATIONS =================
const GREET={alegre:['¡Qué dicha verte! Hoy está un día bien tuanis.','¡Pura vida! ¿Todo bien por la casa?','¡Ey! Justo pensaba en vos. Bueno, no, pero suena bonito.'],
 bromista:['¿Diay? ¿Te perdiste o qué?','Dicen que el que madruga... se cansa más temprano.','No me veás así que no te debo plata... creo.'],
 tranquilo:['Aquí, tranqui, viendo pasar el día.','Todo bien, sin estrés. ¿Y vos?','Mae, qué paz hay hoy.'],
 serio:['Buenas.','Hmm. ¿Se le ofrece algo?','Ajá. Que esté bien.'],
 cariñosa:['¡Ay, mi amor! ¿Cómo está?','¿Ya comió? Lo veo con hambre.','¡Qué gusto verle! Salude a su gente de mi parte.'],
 conversadora:['¿Supo lo del vecino? Bueno, yo tampoco, pero algo pasó.','Aquí, con el chisme fresco del barrio.','Le cuento que el bus de las siete pasó a las siete y veinte. ¡Increíble!'],
 timido:['Ah... hola.','Eh... buenas.','(Te saluda con la mano, un poco apenado.)']};
const TALKMORE={alegre:'¡Hoy es de esos días en que todo sale bien! Lo presiento.',bromista:'Te cuento un chiste: ¿qué hace una abeja en el gimnasio? ¡Zum-ba!',tranquilo:'Uno aprende a disfrutar lo simple: un cafecito, la sombra de un árbol...',serio:'Hay que ser responsable. Eso es lo importante.',cariñosa:'Cuídese mucho, ¿oyó? Y abríguese si llueve.',conversadora:'Doña tal se compró una refri nueva, el de la esquina pintó la casa... ¡aquí no se escapa nada!',timido:'Me gusta este barrio... aunque no hable mucho.'};
function timeHi(){const p=period();return p==='m'?'Buenos días':p==='n'||p==='e'?'Buenas noches':'Buenas tardes'}
function rot(id,arr){const k='ci_'+id;const i=(S.f[k]||0)%arr.length;S.f[k]=(S.f[k]||0)+1;return arr[i]}
const TALKMORE2={alegre:['¡Hoy es de esos días en que todo sale bien! Lo presiento.','Hoy me levanté con el pie derecho. Bueno, me tropecé con el izquierdo, pero después todo bien.','¡Pura vida! Esa palabra lo arregla todo, ¿verdad?'],
 bromista:['¿Qué hace una abeja en el gimnasio? ¡Zum-ba!','¿Sabe por qué el bus de aquí nunca llega a tiempo? Porque Don Beto para a conversar en cada parada.','Diay, si el chisme pagara impuestos, este barrio sería rico.'],
 tranquilo:['Uno aprende a disfrutar lo simple: un cafecito, la sombra de un árbol...','No hay prisa, mae. Las cosas buenas llegan… como La Chancha: tarde, pero llegan.'],
 serio:['Hay que ser responsable. Eso es lo importante.','El que madruga, Dios le ayuda. El que no, que no se queje.'],
 cariñosa:['Cuídese mucho, ¿oyó? Y abríguese si llueve.','¿Ya comió? Venga, que siempre hay un platito de gallo pinto para usted.'],
 conversadora:['¿Supo que abrieron un chino en la esquina? Dicen que hasta chancletas venden. ¡Y baratas!','Dicen que a uno lo asaltaron anoche en la entrada. Yo no digo nada, pero ahí estaba Carlillos… o no estaba. Usted me entiende.','¿Ya vio lo caro que está el pollo? Pero igual los domingos todo el mundo va a Pollolandia.'],
 timido:['Eh… bonito día, ¿verdad?','…Me gusta su camisa. Bueno, no sé. Perdón.']};
function genericTalk(c){const g=GREET[c.pers]||GREET.alegre;say(c.id,rot(c.id+'g',g),[
  {t:'¿Qué contás?',f(){say(c.id,S.rain?'Con este aguacero, poco. ¡Se me mojó hasta el alma!':pickR(TALKMORE2[c.pers]||TALKMORE2.alegre))}},
  {t:'Contame de vos',f(){say(null,'Sobre '+c.name+': '+(c.desc||'No suele contar mucho de su vida.'));say(c.id,c.pers==='timido'?'...eso es todo, creo.':'¡Así soy yo!')}},
  {t:timeHi()+', nos vemos',f(){say(c.id,c.pers==='serio'?'Vaya con cuidado.':'¡Dichosos los ojos! Nos vemos.')}}])}
function meet(id){S.met[id]=1;if(['ariana','nicolas','matias'].every(i=>S.met[i]))afterD(()=>doneQ('barra'))}
const visGift=()=>S.f.vGift||(hasI('queque')?'queque':hasI('coca')?'coca':'nada');
function checkVisita(){if(S.f.vPapa&&S.f.vMama&&qs('visita')===1)afterD(()=>doneQ('visita'))}
