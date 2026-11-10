/* Lipa: sklonska igra (60 sekund).
   Samostalniki: [imenovalnik, angleško, vrsta (p = oseba/žival, l = kraj, f = hrana/stvar),
                  rodilnik, dajalnik, tožilnik, mestnik, orodnik] */
window.LIPA_NOUNS = [
 ["mama","mum","p","mame","mami","mamo","mami","mamo"],
 ["sestra","sister","p","sestre","sestri","sestro","sestri","sestro"],
 ["babica","grandma","p","babice","babici","babico","babici","babico"],
 ["prijateljica","friend (f)","p","prijateljice","prijateljici","prijateljico","prijateljici","prijateljico"],
 ["brat","brother","p","brata","bratu","brata","bratu","bratom"],
 ["oče","father","p","očeta","očetu","očeta","očetu","očetom"],
 ["dedek","grandpa","p","dedka","dedku","dedka","dedku","dedkom"],
 ["prijatelj","friend (m)","p","prijatelja","prijatelju","prijatelja","prijatelju","prijateljem"],
 ["sosed","neighbour","p","soseda","sosedu","soseda","sosedu","sosedom"],
 ["pes","dog","p","psa","psu","psa","psu","psom"],
 ["hiša","house","l","hiše","hiši","hišo","hiši","hišo"],
 ["šola","school","l","šole","šoli","šolo","šoli","šolo"],
 ["trgovina","shop","l","trgovine","trgovini","trgovino","trgovini","trgovino"],
 ["mesto","town","l","mesta","mestu","mesto","mestu","mestom"],
 ["morje","sea","l","morja","morju","morje","morju","morjem"],
 ["jezero","lake","l","jezera","jezeru","jezero","jezeru","jezerom"],
 ["kava","coffee","f","kave","kavi","kavo","kavi","kavo"],
 ["torta","cake","f","torte","torti","torto","torti","torto"],
 ["juha","soup","f","juhe","juhi","juho","juhi","juho"],
 ["kruh","bread","f","kruha","kruhu","kruh","kruhu","kruhom"],
 ["sir","cheese","f","sira","siru","sir","siru","sirom"],
 ["čaj","tea","f","čaja","čaju","čaj","čaju","čajem"],
 ["mleko","milk","f","mleka","mleku","mleko","mleku","mlekom"],
 ["jabolko","apple","f","jabolka","jabolku","jabolko","jabolku","jabolkom"],
 ["avto","car","f","avta","avtu","avto","avtu","avtom"],
 ["telefon","phone","f","telefona","telefonu","telefon","telefonu","telefonom"]
];
/* Stavki za vsak sklon: {x} je beseda, {kh} pomeni k/h, {sz} pomeni s/z (izbere se samodejno). */
window.LIPA_CASES = [
 {n:"Rodilnik",q:"koga? česa?",c:3,t:{p:["Brez {x} ne grem nikamor.","I'm not going anywhere without my {e}."],l:["Blizu {x} je park.","There's a park near the {e}."],f:["Nimam več {x}.","I've run out of {e}."]}},
 {n:"Dajalnik",q:"komu? čemu?",c:4,t:{p:["Grem {kh} {x}.","I'm going to see my {e}."],l:["Grem proti {x}.","I'm walking towards the {e}."]}},
 {n:"Tožilnik",q:"koga? kaj?",c:5,t:{p:["Vidim {x}.","I can see my {e}."],l:["Vidim {x}.","I can see the {e}."],f:["Rad bi {x}.","I'd like the {e}."]}},
 {n:"Mestnik",q:"o kom? o čem?",c:6,t:{p:["Govorim o {x}.","I'm talking about my {e}."],l:["Govorim o {x}.","I'm talking about the {e}."],f:["Razmišljam o {x}.","I'm thinking about the {e}."]}},
 {n:"Orodnik",q:"s kom? s čim?",c:7,t:{p:["Grem v kino {sz} {x}.","I'm going to the cinema with my {e}."],l:["Čakam pred {x}.","I'm waiting in front of the {e}."],f:["Kaj boš {sz} {x}?","What will you do with the {e}?"]}}
];

window.LipaGame = (function(){
 let G=null,filter=-1,timer=null;
 const best=()=>(S.best&&S.best.cases)||0;
 const pick=a=>a[Math.random()*a.length|0];
 function makeQ(){
  for(let tries=0;tries<50;tries++){
   const ci=filter>=0?filter:Math.random()*LIPA_CASES.length|0,cs=LIPA_CASES[ci],nn=pick(LIPA_NOUNS),tp=cs.t[nn[2]];
   if(!tp)continue;
   const ans=nn[cs.c];
   const kh=/^[kg]/i.test(ans)?"h":"k",sz=/^[pfkthščcč]/i.test(ans)?"s":"z";
   const sent=tp[0].replace("{kh}",kh).replace("{sz}",sz);
   const forms=uniq([nn[0],nn[3],nn[4],nn[5],nn[6],nn[7]]).filter(f=>f!==ans);
   if(forms.length<2)continue;
   return{ci,nn,ans,sent,en:tp[1].replace("{e}",nn[1]),o:sh([ans,...sh(forms).slice(0,2)])};
  }
 }
 function start(){G={score:0,combo:0,left:60,q:makeQ(),lock:false,wrong:[]};clearInterval(timer);timer=setInterval(tick,1000);draw()}
 function tick(){if(!G)return;G.left--;const b=document.getElementById("gtime");if(b){b.style.width=(G.left/60*100)+"%";const n=document.getElementById("gsec");if(n)n.textContent=G.left}
  if(G.left<=0||view!=="play")end()}
 function end(){clearInterval(timer);if(!G)return;const sc=G.score;S.best=S.best||{};const nb=sc>best();if(nb)S.best.cases=sc;if(sc>0)gainXp(Math.min(sc,40));else save();G.over={sc,nb};if(view==="play")render()}
 function answer(i){if(!G||G.lock||G.over)return;const q=G.q,ok=q.o[i]===q.ans;G.lock=true;
  document.querySelectorAll("[data-gopt]").forEach((b,j)=>{if(q.o[j]===q.ans)b.classList.add("right");else if(j===i)b.classList.add("wrong")});
  if(ok){G.combo++;G.score+=G.combo>=5?2:1}else{G.combo=0;G.wrong.push(q)}
  setTimeout(()=>{if(!G||G.over)return;G.q=makeQ();G.lock=false;draw()},ok?450:1300);
  const sc=document.getElementById("gscore");if(sc)sc.textContent=G.score;
 }
 function chips(){return`<div class="gchips"><button class="chip2 ${filter<0?"on":""}" data-gf="-1">All cases</button>${LIPA_CASES.map((c,i)=>`<button class="chip2 ${filter===i?"on":""}" data-gf="${i}">${c.n}</button>`).join("")}</div>`}
 function html(){
  if(G&&!G.over)return play();
  if(G&&G.over){const seen=new Set(),w=G.wrong.filter(q=>{const k=q.sent+q.ans;if(seen.has(k))return false;seen.add(k);return true}).slice(-5);return`<header class="ph"><h1>Case game</h1></header><div class="gcard gend"><p class="q">Time's up!</p><div class="gbig">${G.over.sc}</div><p>${G.over.nb?"New personal best! 🎉":`Your best: ${best()}`}</p>${G.over.sc?`<p class="hint">+${Math.min(G.over.sc,40)} XP</p>`:""}${w.length?`<div class="gmiss"><b>Worth another look:</b>${w.map(q=>`<div>${q.sent.replace("{x}","<b>"+q.ans+"</b>")} <span class="e">(${q.nn[0]}, ${LIPA_CASES[q.ci].n.toLowerCase()})</span></div>`).join("")}</div>`:""}<button class="btn" data-gact="start">Play again</button> <button class="ghost" data-gact="menu">Change cases</button></div>`}
  return`<header class="ph"><h1>Case game</h1><p>60 seconds. Pick the right ending as fast as you can. Five in a row and every answer counts double.</p></header>
  <div class="gcard">${chips()}<table class="gt gq">${LIPA_CASES.map(c=>`<tr><td>${c.n}</td><td><b>${c.q}</b></td></tr>`).join("")}</table><p>Your best: <b>${best()}</b></p><button class="btn" data-gact="start">Start</button></div>`;
 }
 function play(){const q=G.q;return`<div class="gtop"><div class="gbar"><i id="gtime" style="width:${G.left/60*100}%"></i></div><span class="gsc"><span id="gsec">${G.left}</span>s · <b id="gscore">${G.score}</b>${G.combo>=5?" 🔥":""}</span></div>
  <div class="gcard"><p class="q">${LIPA_CASES[q.ci].n} · ${LIPA_CASES[q.ci].q}</p><p class="gsent">${q.sent.replace("{x}",'<span class="blank">&nbsp;</span>')}</p><p class="hint">${q.en} <span class="e">(${q.nn[0]})</span></p>
  <div class="opts row">${q.o.map((o,i)=>`<button class="opt" data-gopt="${i}">${o}</button>`).join("")}</div><p class="hint gk">Keys 1, 2, 3 work too.</p></div>`}
 function draw(){const m=document.getElementById("main");if(view==="play")m.innerHTML=html()}
 document.addEventListener("click",e=>{const t=e.target;
  const o=t.closest("[data-gopt]");if(o){answer(+o.dataset.gopt);return}
  const f=t.closest("[data-gf]");if(f){filter=+f.dataset.gf;draw();return}
  const a=t.closest("[data-gact]");if(a){if(a.dataset.gact==="start")start();else{G=null;draw()}}});
 document.addEventListener("keydown",e=>{if(view==="play"&&G&&!G.over&&!L&&/^[123]$/.test(e.key))answer(+e.key-1)});
 return{html,stop:()=>{if(G&&!G.over)end()}};
})();
