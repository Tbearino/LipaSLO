/* ---------------- COURSE CONTENT (edit here) ---------------- */
const LV={A1:window.LIPA_A1,A2:window.LIPA_A2,B1:window.LIPA_B1,B2:window.LIPA_B2};};

const LVINFO={
  A1:{d:"Beginner course, level A1",top:"Šmarna gora, 669 m"},
  A2:{d:"Elementary course, level A2",top:"Velika planina, 1666 m"},
  B1:{d:"Intermediate course, level B1",top:"Snežnik, 1796 m"},
  B2:{d:"Upper intermediate course, level B2",top:"Stol, 2236 m"},
  C1:{d:"Advanced course, level C1",top:"Triglav, 2864 m"}
};let lvl=(()=>{try{const l=localStorage.getItem("lipa-level");if(l&&LV[l])return l}catch(e){}return"A1"})();
let C=LV[lvl];
const K=(ci,li)=>(lvl==="A1"?"":lvl+":")+ci+"-"+li;
const LN=[{n:"New words",ic:"book"},{n:"More words",ic:"cards"},{n:"Conversation",ic:"chat"},{n:"Grammar",ic:"blocks"},{n:"Chapter review",ic:"flag"}];
const lname=(ci,li)=>li===4&&C[ci]&&C[ci].r?"Read and write":LN[li].n;
const licon=(ci,li)=>li===4&&C[ci]&&C[ci].r?"pen":LN[li].ic;

/* ---------------- helpers ---------------- */
const IC={
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
 cards:'<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
 blocks:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><path d="M17 13v8M13 17h8"/>',
 flag:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
 sound:'<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
 mount:'<path d="m3 20 6.5-11 4 6 2.5-3.5L21 20z"/>',
 review:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12 5 5 9-10"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',
 pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 slow:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const icon=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const LEAF='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21C6.5 17.6 3.5 13.8 3.5 9.9A4.4 4.4 0 0 1 12 8a4.4 4.4 0 0 1 8.5 1.9c0 3.9-3 7.7-8.5 11.1z"/></svg>';
const $=s=>document.querySelector(s);
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const uniq=a=>[...new Set(a)];
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const norm=s=>s.toLowerCase().replace(/\.\.\./g," ").replace(/[.,!?…"„“”:;()]/g,"").replace(/\s+/g," ").trim();
const plain=s=>norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const W=ci=>C[ci].v.map(s=>{const[sl,en]=s.split("|");return{sl,en}});
const ALLW=()=>C.flatMap((c,i)=>W(i));
const half=ci=>Math.ceil(C[ci].v.length/2);
const toks=s=>s.split(" ");
const clean=t=>t.replace(/[.,!?…]/g,"");

/* ---------------- progress (saved in this browser) ---------------- */
const KEY="lipa-sl-a1";
const def=()=>({done:{},xp:0,streak:0,last:null,day:null,dayXp:0,goal:30});
let S=(()=>{try{const r=localStorage.getItem(KEY);if(r)return Object.assign(def(),JSON.parse(r))}catch(e){}return def()})();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const today=()=>new Date().toLocaleDateString("sv");
const yday=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toLocaleDateString("sv")};
const chDone=ci=>LN.filter((_,li)=>S.done[K(ci,li)]).length;
const totalDone=()=>C.reduce((n,_,ci)=>n+chDone(ci),0);
const nextLesson=()=>{for(let ci=0;ci<C.length;ci++)for(let li=0;li<5;li++)if(!S.done[K(ci,li)])return[ci,li];return null};
const learned=()=>C.reduce((n,c,ci)=>n+(S.done[K(ci,0)]?half(ci):0)+(S.done[K(ci,1)]?c.v.length-half(ci):0),0);
const totalW=()=>C.reduce((n,c)=>n+c.v.length,0);
const NL=()=>C.length*5;
const dayXp=()=>S.day===today()?S.dayXp:0;
try{const th=localStorage.getItem("lipa-theme");if(th)document.documentElement.dataset.theme=th}catch(e){}

/* ---------------- audio ---------------- */
let voice=null,warned=false;
const hasTTS="speechSynthesis" in window;
function pickVoice(){const vs=speechSynthesis.getVoices();voice=vs.find(v=>/^sl/i.test(v.lang))||null}
if(hasTTS){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
function say(t,cb){
  if(!hasTTS){cb&&cb();return}
  if(!voice&&!warned){warned=true;toast("This device has no Slovenian voice installed, so audio may sound off.")}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t.replace(/\.\.\./g,""));
  u.lang="sl-SI";if(voice)u.voice=voice;u.rate=.88;
  u.onend=()=>cb&&cb();u.onerror=()=>cb&&cb();
  speechSynthesis.speak(u);
}
const sayBtn=t=>`<button class="say" data-say="${esc(t)}" aria-label="Listen">${icon("sound",18)}</button>`;
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),3800)}

/* ---------------- views ---------------- */
let view="learn",openCh=new Set();
const NAV={learn:["Learn","mount"],review:["Review","review"],words:["Words","book"]};
function renderNav(){document.querySelectorAll(".nl").forEach(b=>{const[n,i]=NAV[b.dataset.view];b.innerHTML=icon(i,22)+`<span>${n}</span>`;b.toggleAttribute("aria-current",b.dataset.view===view);if(b.dataset.view===view)b.setAttribute("aria-current","page")})}
function stats(){
  const dx=dayXp(),pct=Math.min(100,Math.round(dx/S.goal*100)),done=totalDone();
  $("#rail").innerHTML=`
  <div class="panel streak"><div class="num">${S.streak}</div><div><h3>Day streak</h3><p>${S.streak?"Keep it going with a lesson today.":"Finish a lesson to start one."}</p></div></div>
  <div class="panel goal"><div class="ring" style="--p:${pct}"><span>${pct}%</span></div><div><h3>Daily goal</h3><p>${dx} of ${S.goal} XP today</p></div></div>
  <div class="panel"><h3>Slovenian ${lvl}</h3><div class="meter"><i style="width:${done/NL()*100}%"></i></div><p>${done} of ${NL()} lessons done</p><p>${learned()} of ${totalW()} words learned</p></div>
  <div class="panel"><h3>${S.xp} XP</h3><p>Total points earned</p></div>`;
  return `<div class="mstats"><span class="chip">Streak <b>${S.streak}</b></span><span class="chip">Today <b>${dx}/${S.goal}</b> XP</span><span class="chip">${lvl} <b>${done}</b>/${NL()} lessons</span></div>`;
}
function render(){
  renderNav();const ms=stats();const m=$("#main");
  if(view==="learn")m.innerHTML=ms+learnHTML();
  if(view==="words")m.innerHTML=ms+wordsHTML();
  if(view==="review")m.innerHTML=ms+reviewHTML();
}
function learnHTML(){
  const nx=nextLesson();
  if(nx&&!openCh.size)openCh.add(nx[0]);
  const hero=nx?`<section class="hero"><div class="leaf">${LEAF}</div>
    <p class="meta">Chapter ${nx[0]+1}, ${lname(nx[0],nx[1]).toLowerCase()}</p>
    <h2 class="sl">${C[nx[0]].t}</h2><p class="en">${C[nx[0]].e}</p>
    <button class="btn" data-start="${nx[0]}-${nx[1]}">${totalDone()?"Continue lesson":"Start your first lesson"}</button></section>`
   :`<section class="hero"><div class="leaf">${LEAF}</div><p class="meta">Course complete</p><h2 class="sl">Čestitke!</h2><p class="en">Congratulations, you've finished Slovenian ${lvl}. Keep your words fresh in Review.</p><button class="btn" data-view="review">Go to review</button></section>`;
  const tabs=["A1","A2","B1","B2"].map((l,i)=>`<button class="tab" role="tab" aria-selected="${l===lvl}" ${LV[l]?`data-lvl="${l}"`:'disabled title="Coming soon"'}>${l}</button>`).join("");
  const chs=C.map((c,ci)=>{
    const d=chDone(ci),p=d/5*100,cls=d===5?"full":d?"part":"";
    const rows=LN.map((l,li)=>{const k=ci+"-"+li,ok=S.done[K(ci,li)];return`<li><button class="lrow ${ok?"done":""}" data-start="${k}"><span class="lic">${icon(ok?"check":licon(ci,li))}</span><span class="nm">${lname(ci,li)}</span><span class="st">${ok?"Done":"Start"}</span></button></li>`}).join("");
    return`<li class="ch ${openCh.has(ci)?"open":""}"><div class="node ${cls}" style="--p:${p}"><span>${d===5?icon("check",18):ci+1}</span></div>
      <button class="chhead" data-ch="${ci}" aria-expanded="${openCh.has(ci)}"><span><h3>${c.t}</h3><span class="en">${c.e}</span></span><span class="cnt">${d} of 5</span><span class="chev">${icon("chev")}</span></button>
      <ul class="lessons">${rows}</ul></li>`}).join("");
  return`<header class="lvl"><div><h1>Slovenian</h1><p>${LVINFO[lvl].d}</p></div><div class="tabs" role="tablist">${tabs}</div></header>${hero}
   <ol class="trail">${chs}<li class="summit"><div class="node"><span>${icon("mount",22)}</span></div><h3>${LVINFO[lvl].top}</h3><p>Finish all ${C.length} chapters to reach the ${lvl} summit.</p></li></ol>`;
}
function wordsHTML(){
  const sec=C.map((c,ci)=>{const h=half(ci);return`<section class="wsec" data-sec><h2>${c.t}<small>${c.e}</small></h2><div class="wlist">${W(ci).map((w,i)=>{const on=S.done[K(ci,i<h?0:1)];return`<div class="wrow" data-w="${esc((w.sl+" "+w.en).toLowerCase())}"><span class="dot ${on?"on":""}" title="${on?"Learned":"Not learned yet"}"></span><span class="s">${w.sl}</span><span class="e">${w.en}</span>${sayBtn(w.sl)}</div>`}).join("")}</div></section>`}).join("");
  const note=hasTTS&&!voice?`<p class="note">Your device has no Slovenian voice, so audio uses a fallback. On Windows you can add one under Settings, Time and language, Speech.</p>`:"";
  return`<header class="ph"><h1>Words</h1><p>All ${totalW()} words from the ${lvl} course. A green dot means you've learned it in a lesson.</p><input class="search" type="search" placeholder="Search in Slovenian or English" data-search aria-label="Search words">${note}</header>${sec}`;
}
function reviewHTML(){
  const started=C.map((_,i)=>i).filter(i=>chDone(i));
  return`<header class="ph"><h1>Review</h1><p>Short mixed practice with words from the chapters you've started, so they stick.</p></header>
  <div class="revcard"><h2>Quick review</h2><p>${started.length?`10 questions from ${started.length} chapter${started.length>1?"s":""}.`:"You haven't started a chapter yet, so this review uses ${C[0].t} (${C[0].e})."}</p><button class="btn" data-act="review">Start review</button></div>`;
}

/* ---------------- exercise builders ---------------- */
function pool(ci){const w=W(ci);return w.concat(W(ci>0?ci-1:ci+1))}
function mcStep(ci,w,dir){
  const toEn=dir==="sl",key=toEn?"en":"sl";
  const o=uniq([w[key],...sh(pool(ci).map(x=>x[key]).filter(x=>x!==w[key]))]).slice(0,4);
  return{k:"mc",q:toEn?"Choose the meaning":"Choose the Slovenian",big:toEn?w.sl:w.en,bigSay:toEn,o:sh(o),a:w[key],say:w.sl};
}
const typeStep=w=>({k:"type",big:w.en,a:[w.sl],say:w.sl});
const matchStep=ws=>({k:"match",ws});
function gapStep(line,all){
  const t=toks(line[1]);const idx=sh(t.map((_,i)=>i).filter(i=>clean(t[i]).length>=3));if(!idx.length)return null;
  const i=idx[0],ans=clean(t[i]),cap=ans[0]!==ans[0].toLowerCase();
  const fix=x=>cap?x[0].toUpperCase()+x.slice(1):x.toLowerCase();
  const ds=sh(uniq(all.map(clean).filter(x=>x.length>=3&&x.toLowerCase()!==ans.toLowerCase()).map(fix))).slice(0,2);
  return{k:"gap",p:t.map((x,j)=>j===i?x.replace(ans,"___"):x).join(" "),hint:line[2],o:sh([ans,...ds]),a:ans,say:line[1]};
}
function orderStep(line){let tiles=sh(toks(line[1]));if(tiles.join(" ")===line[1])tiles=sh(tiles);return{k:"order",hint:line[2],tiles,a:line[1],say:line[1]}}
function meaningStep(d,i){return{k:"mc",q:"What does this mean?",big:d[i][1],bigSay:true,o:sh(uniq([d[i][2],...sh(d.filter((_,j)=>j!==i).map(x=>x[2])).slice(0,2)])),a:d[i][2],say:d[i][1]}}
function drill(d){
  if(d.k==="type")return{k:"type",big:d.p,a:d.a,say:d.a[0]};
  if(d.k==="gap")return{k:"gap",p:d.p,hint:d.h,o:sh(d.o),a:d.o[0],say:d.p.replace("___",d.o[0]).replace(/^\(.*?\)\s*/,"")};
  return{k:"mc",q:d.p,big:"",o:sh(d.o),a:d.o[0],say:/[a-zčšž]/i.test(d.o[0])&&!/^\d+$/.test(d.o[0])&&!/^[a-z ]+$/i.test(d.o[0])?d.o[0]:null,plainQ:true};
}
function vocabSteps(ci,ws,withType){
  const st=[];
  for(let i=0;i<ws.length;i+=2){const ch=ws.slice(i,i+2);ch.forEach(w=>st.push({k:"card",w}));ch.forEach((w,j)=>st.push(mcStep(ci,w,(i+j)%2?"en":"sl")))}
  if(ws.length>=4)st.push(matchStep(sh(ws).slice(0,5)));
  if(withType)sh(ws).slice(0,3).forEach(w=>st.push(typeStep(w)));
  return st;
}
function buildLesson(ci,li){
  const c=C[ci],ws=W(ci),h=half(ci);
  if(li===0)return vocabSteps(ci,ws.slice(0,h),false);
  if(li===1)return vocabSteps(ci,ws.slice(h),true);
  if(li===2){
    const d=c.d,all=d.flatMap(x=>toks(x[1]));
    const idx=sh(d.map((_,i)=>i)),ord=idx.filter(i=>{const n=toks(d[i][1]).length;return n>=3&&n<=8});
    const sh7=idx.filter(i=>toks(d[i][1]).length<=7);const lst=sh7.length?{k:"listen",a:[d[sh7[sh7.length-1]][1]],hint:d[sh7[sh7.length-1]][2],say:d[sh7[sh7.length-1]][1]}:null;
    return[{k:"dialog",d},gapStep(d[idx[0]],all),lst,ord[0]!=null?orderStep(d[ord[0]]):null,gapStep(d[idx[1]],all),ord[1]!=null?orderStep(d[ord[1]]):null,meaningStep(d,idx[2])].filter(Boolean);
  }
  if(li===3)return[{k:"gram",g:c.g},...c.g.q.map(drill)];
  const r=sh(ws);
  if(c.r){
    const rq=c.r.q.map(q=>({k:"mc",plainQ:true,q:q.p,o:sh(q.o),a:q.o[0],ctx:c.r.x}));
    const mix=sh([mcStep(ci,r[0],"sl"),mcStep(ci,r[1],"en"),{k:"listen",a:[r[2].sl],hint:r[2].en,say:r[2].sl},typeStep(r[3]),...sh(c.g.q).slice(0,2).map(drill)]);
    return[{k:"read",r:c.r},...rq,...mix,...(c.w?[{k:"write",w:c.w}]:[])];
  }
  const st=[...r.slice(0,4).map((w,i)=>mcStep(ci,w,i%2?"en":"sl")),...r.slice(4,7).map(typeStep),...sh(c.g.q).slice(0,2).map(drill)];
  const ol=c.d.filter(x=>{const n=toks(x[1]).length;return n>=3&&n<=8});if(ol.length)st.push(orderStep(sh(ol)[0]));
  const out=sh(st);out.splice(4,0,matchStep(r.slice(7,12).length>=4?r.slice(7,12):r.slice(0,5)));return out;
}
function buildReview(){
  let chs=C.map((_,i)=>i).filter(i=>chDone(i));if(!chs.length)chs=[0];
  const items=sh(chs.flatMap(ci=>W(ci).map(w=>({ci,w}))));
  const st=[...items.slice(0,6).map((x,i)=>mcStep(x.ci,x.w,i%2?"en":"sl")),...items.slice(6,9).map(x=>typeStep(x.w))];
  const out=sh(st);out.splice(5,0,matchStep(items.slice(9,14).map(x=>x.w).length>=4?items.slice(9,14).map(x=>x.w):items.slice(0,5).map(x=>x.w)));return out;
}

/* ---------------- lesson player ---------------- */
let L=null;
const PRAISE=["Odlično!","Bravo!","Tako je!","Super!","Zelo dobro!"];
function startLesson(ci,li,steps){
  L={ci,li,steps:steps||buildLesson(ci,li),i:0,correct:0,wrong:0,finished:false};
  $("#lesson").classList.add("on");document.body.style.overflow="hidden";renderStep();
}
function closeLesson(){if(hasTTS)speechSynthesis.cancel();$("#lesson").classList.remove("on");document.body.style.overflow="";L=null;render()}
function foot(mode,msg){
  L.mode=mode;const f=$("#lfoot");f.className="lfoot"+(mode==="good"?" good":mode==="bad"?" bad":"");
  $("#fb").innerHTML=msg||"";const g=$("#go");g.textContent=mode==="check"?"Check":"Continue";
  g.disabled=mode==="check"||mode==="wait";
}
const enable=()=>{$("#go").disabled=false};
function renderStep(){
  const s=L.steps[L.i];L.wrote=false;L.sel=null;L.ord=[];L.m={l:null,ok:0,miss:0};
  $("#barfill").style.width=(L.i/L.steps.length*100)+"%";
  const st=$("#stage");st.className="stage";st.innerHTML=R[s.k](s);
  $(".lbody").scrollTop=0;
  if(s.k==="card"){foot("next");say(s.w.sl)}
  else if(s.k==="dialog"||s.k==="gram"||s.k==="read")foot("next");
  else if(s.k==="write"){foot("wait");const ta=$("#wr");ta.focus();ta.addEventListener("input",()=>{if(ta.value.trim().length>=10)wdone()})}
  else if(s.k==="match")foot("wait");
  else foot("check");
  if(s.k==="listen")setTimeout(()=>say(s.a[0]),250);
  if(s.k==="type"||s.k==="listen"){const inp=$("#ans");inp.focus();inp.addEventListener("input",()=>{$("#go").disabled=!inp.value.trim()})}
}
const R={
  card:s=>`<p class="q">New word</p><div class="big">${s.w.sl} ${sayBtn(s.w.sl)}</div><p class="trans">${s.w.en}</p>`,
  mc:s=>`${s.ctx?`<div class="ctx">${s.ctx}</div>`:""}<p class="q">${s.plainQ?(s.ctx?"Answer the question":"Choose the right answer"):s.q}</p>${s.plainQ?`<div class="big ${s.q.length>22?"long":""}">${s.q}</div>`:`<div class="big ${s.big.length>20?"long":""}">${s.big} ${s.bigSay?sayBtn(s.big):""}</div>`}<div class="opts">${s.o.map((o,i)=>`<button class="opt" data-opt="${i}">${o}</button>`).join("")}</div>`,
  listen:s=>`<p class="q">Type what you hear</p><div class="big"><button class="say lg" data-say="${esc(s.a[0])}" aria-label="Play again">${icon("sound",26)}</button><button class="say lg" data-slow="${esc(s.a[0])}" aria-label="Play slowly">${icon("slow",24)}</button></div><input class="ans" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" lang="sl" aria-label="What you heard"><div class="keys">${["č","š","ž"].map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div>`,
  read:s=>`<p class="q">Read the text. Tap the speaker to hear it.</p><h2 class="gh">${s.r.t} ${sayBtn(s.r.x)}</h2><div class="reading"><p>${s.r.x}</p></div>`,
  write:s=>`<p class="q">Your turn to write</p><p class="wp">${s.w.p}</p><textarea class="ans wr" id="wr" rows="5" lang="sl" spellcheck="false" aria-label="Your text"></textarea><div class="keys">${["č","š","ž"].map(k=>`<button data-key="${k}">${k}</button>`).join("")}<button class="ghost" data-act="model">Show an example answer</button><button class="ghost" data-act="copy">Copy my text</button></div><div class="model" id="model"><b>Example:</b> ${s.w.m} ${sayBtn(s.w.m)}</div><p class="hint wn">Tip: send your text to a native speaker and ask them to correct it. That is how you learn the most.</p>`,
  gap:s=>`<p class="q">Fill in the gap</p><p class="sent">${s.p.replace("___",'<span class="blank" id="blank">&nbsp;</span>')}</p><p class="hint">${s.hint||""}</p><div class="opts row">${s.o.map((o,i)=>`<button class="opt" data-opt="${i}">${o}</button>`).join("")}</div>`,
  type:s=>`<p class="q">Write this in Slovenian</p><div class="big ${s.big.length>20?"long":""}">${s.big}</div><input class="ans" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" lang="sl" aria-label="Your answer"><div class="keys">${["č","š","ž"].map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div>`,
  order:s=>`<p class="q">Put the words in order</p><p class="hint">${s.hint}</p><div class="ansline" id="al"></div><div class="bank">${s.tiles.map((t,i)=>`<button class="tile" data-tile="${i}">${t}</button>`).join("")}</div>`,
  match:s=>{const l=sh(s.ws.map((_,i)=>i)),r=sh(s.ws.map((_,i)=>i));return`<p class="q">Match the pairs</p><div class="match"><div class="col">${l.map(i=>`<button class="mt" data-ml="${i}">${s.ws[i].sl}</button>`).join("")}</div><div class="col">${r.map(i=>`<button class="mt" data-mr="${i}">${s.ws[i].en}</button>`).join("")}</div></div>`},
  dialog:s=>{const sp=uniq(s.d.map(x=>x[0]));return`<p class="q">Listen and read. Tap a line to see the translation.</p><button class="ghost" data-act="playall">${icon("sound",18)} Play conversation</button><div class="dl">${s.d.map(x=>`<div class="line ${sp.indexOf(x[0])%2?"r":""}"><button class="bub" data-bub><div class="who">${x[0]}</div><div class="s">${x[1]}</div><div class="e">${x[2]}</div></button>${sayBtn(x[1])}</div>`).join("")}</div>`},
  gram:s=>`<h2 class="gh">${s.g.t}</h2><div class="gbody">${s.g.h}</div>`
};
function answerText(s){if(s.k==="type"||s.k==="listen")return s.a[0];return s.a}
function wdone(){if(L.wrote)return;L.wrote=true;L.correct++;enable()}
function doCheck(){
  const s=L.steps[L.i];let ok=false,extra="";
  if(s.k==="mc"||s.k==="gap"){
    ok=s.o[L.sel]===s.a;
    document.querySelectorAll(".opt").forEach((b,i)=>{b.classList.remove("sel");if(s.o[i]===s.a)b.classList.add("right");else if(i===L.sel)b.classList.add("wrong")});
    if(s.k==="gap")$("#blank").textContent=s.a;
  }else if(s.k==="type"||s.k==="listen"){
    const v=$("#ans").value;
    if(s.a.some(a=>norm(a)===norm(v)))ok=true;
    else if(s.a.some(a=>plain(a)===plain(v))){ok=true;extra=`Watch the letters č, š and ž: <b>${s.a[0]}</b>`}
  }else if(s.k==="order"){
    ok=norm(L.ord.map(i=>s.tiles[i]).join(" "))===norm(s.a);
  }
  $("#stage").classList.add("locked");
  if(ok){L.correct++;foot("good",`<strong>${PRAISE[Math.random()*PRAISE.length|0]}</strong>${extra}`)}
  else{L.wrong++;if(!s.re)L.steps.push(Object.assign({},s,{re:true,o:s.o?sh(s.o):undefined,tiles:s.tiles?sh(s.tiles):undefined}));foot("bad",`<strong>Not quite</strong>Correct answer: ${answerText(s)}`)}
  if(s.say)say(s.say);
}
function next(){
  if(L.finished){closeLesson();return}
  L.i++;if(L.i>=L.steps.length)finish();else renderStep();
}
function finish(){
  const isReview=L.ci==null,key=K(L.ci,L.li);
  if(!isReview)S.done[key]=true;
  const xp=L.correct+(isReview?3:5),t=today();
  if(S.day!==t){S.day=t;S.dayXp=0}
  S.dayXp+=xp;S.xp+=xp;
  if(S.last!==t){S.streak=S.last===yday()?S.streak+1:1;S.last=t}
  save();
  const acc=Math.round(L.correct/Math.max(1,L.correct+L.wrong)*100);
  $("#barfill").style.width="100%";L.finished=true;
  if(!isReview&&L.li===4)openCh.clear();
  $("#stage").innerHTML=`<div class="done">${LEAF}<h2>${isReview?"Review done":"Lesson complete"}</h2><p>${isReview?"Your words are fresher now.":C[L.ci].t+", "+lname(L.ci,L.li).toLowerCase()}</p><div class="stats"><div><b>+${xp}</b><span>XP</span></div><div><b>${acc}%</b><span>accuracy</span></div><div><b>${S.streak}</b><span>day streak</span></div></div></div>`;
  foot("next");
}

/* ---------------- events ---------------- */
document.addEventListener("click",e=>{
  const t=e.target;
  const sb=t.closest("[data-say]");if(sb){say(sb.dataset.say);return}
  const lv=t.closest("[data-lvl]");if(lv){lvl=lv.dataset.lvl;C=LV[lvl];openCh.clear();try{localStorage.setItem("lipa-level",lvl)}catch(e){}render();return}
  const v=t.closest("[data-view]");if(v){view=v.dataset.view;render();window.scrollTo(0,0);return}
  const stt=t.closest("[data-start]");if(stt){const[ci,li]=stt.dataset.start.split("-").map(Number);startLesson(ci,li);return}
  const ch=t.closest("[data-ch]");if(ch){const ci=+ch.dataset.ch;openCh.has(ci)?openCh.delete(ci):openCh.add(ci);render();return}
  const a=t.closest("[data-act]");
  if(a){const act=a.dataset.act;
    if(act==="close")closeLesson();
    if(act==="model"){$("#model").classList.add("show");if(L)wdone()}
    if(act==="copy"){const v=($("#wr")||{}).value||"";try{navigator.clipboard.writeText(v).then(()=>toast("Copied. Paste it into a message to a native speaker."),()=>toast("Select the text and copy it manually."))}catch(e){toast("Select the text and copy it manually.")}}
    if(act==="review")startLesson(null,null,buildReview());
    if(act==="theme"){const cur=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");const n=cur==="dark"?"light":"dark";document.documentElement.dataset.theme=n;try{localStorage.setItem("lipa-theme",n)}catch(e){}}
    if(act==="reset"){if(a.dataset.arm){S=def();save();openCh.clear();a.textContent="Reset progress";delete a.dataset.arm;render()}else{a.dataset.arm=1;a.textContent="Tap again to reset";setTimeout(()=>{if(a.dataset.arm){delete a.dataset.arm;a.textContent="Reset progress"}},3000)}}
    if(act==="playall"&&L){const d=L.steps[L.i].d;let i=0;const bubs=document.querySelectorAll("[data-bub]");const go=()=>{if(!L||i>=d.length)return;bubs[i]&&bubs[i].classList.add("show");say(d[i][1],()=>{i++;setTimeout(go,350)})};go()}
    return}
  if(!L||L.mode==="good"||L.mode==="bad")return;
  const s=L.steps[L.i];
  const op=t.closest("[data-opt]");if(op){L.sel=+op.dataset.opt;document.querySelectorAll(".opt").forEach(b=>b.classList.toggle("sel",b===op));if(s.k==="gap")$("#blank").textContent=s.o[L.sel];enable();return}
  const sl=t.closest("[data-slow]");if(sl){if(hasTTS){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sl.dataset.slow);u.lang="sl-SI";if(voice)u.voice=voice;u.rate=.55;speechSynthesis.speak(u)}return}
  const ky=t.closest("[data-key]");if(ky){const inp=$("#ans")||$("#wr"),p=inp.selectionStart??inp.value.length;inp.value=inp.value.slice(0,p)+ky.dataset.key+inp.value.slice(inp.selectionEnd??p);inp.focus();inp.setSelectionRange(p+1,p+1);enable();return}
  const bb=t.closest("[data-bub]");if(bb){bb.classList.toggle("show");return}
  const tl=t.closest("[data-tile]");if(tl){L.ord.push(+tl.dataset.tile);tl.classList.add("used");drawOrder();return}
  const rm=t.closest("[data-rm]");if(rm){const pos=+rm.dataset.rm,idx=L.ord.splice(pos,1)[0];document.querySelector(`[data-tile="${idx}"]`).classList.remove("used");drawOrder();return}
  const ml=t.closest("[data-ml]"),mr=t.closest("[data-mr]");
  if(ml||mr){
    const side=ml?"l":"r",el=ml||mr,idx=+(ml?ml.dataset.ml:mr.dataset.mr);
    document.querySelectorAll(`[data-m${side}]`).forEach(b=>b.classList.remove("sel"));
    el.classList.add("sel");L.m[side]=idx;L.m[side+"el"]=el;
    if(side==="l")say(s.ws[idx].sl);
    if(L.m.l!=null&&L.m.r!=null){
      const le=L.m.lel,re=L.m.rel;
      if(L.m.l===L.m.r){le.classList.add("ok");re.classList.add("ok");L.m.ok++}
      else{L.m.miss++;[le,re].forEach(b=>{b.classList.add("no");setTimeout(()=>b.classList.remove("no","sel"),450)})}
      le.classList.remove("sel");re.classList.remove("sel");L.m.l=L.m.r=null;
      if(L.m.ok===s.ws.length){L.correct++;foot("good",`<strong>${PRAISE[Math.random()*PRAISE.length|0]}</strong>${L.m.miss?"All pairs matched.":"All pairs matched on the first try."}`)}
    }
  }
});
function drawOrder(){const s=L.steps[L.i];$("#al").innerHTML=L.ord.map((i,p)=>`<button class="tile" data-rm="${p}">${s.tiles[i]}</button>`).join("");$("#go").disabled=!L.ord.length}
$("#go").addEventListener("click",()=>{if(!L)return;if(L.mode==="check")doCheck();else next()});
document.addEventListener("keydown",e=>{
  if(!L)return;
  if(e.key==="Escape")closeLesson();
  if(e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&!$("#go").disabled){e.preventDefault();$("#go").click()}
});
document.addEventListener("input",e=>{
  if(e.target.matches("[data-search]")){const q=e.target.value.toLowerCase().trim();
    document.querySelectorAll("[data-sec]").forEach(sec=>{let any=false;sec.querySelectorAll("[data-w]").forEach(r=>{const m=!q||r.dataset.w.includes(q);r.style.display=m?"":"none";any=any||m});sec.style.display=any?"":"none"})}
});
$('[data-act="close"]').innerHTML=icon("close",22);
render();
