/* ---------------- COURSE CONTENT (edit here) ---------------- */
const LV={A1:window.LIPA_A1,A2:window.LIPA_A2,B1:window.LIPA_B1,B2:window.LIPA_B2,C1:window.LIPA_C1,FAM:window.LIPA_FAM};

const LVINFO={
  A1:{d:"Beginner course, level A1",top:"Šmarna gora, 669 m"},
  A2:{d:"Elementary course, level A2",top:"Velika planina, 1666 m"},
  B1:{d:"Intermediate course, level B1",top:"Snežnik, 1796 m"},
  B2:{d:"Upper intermediate course, level B2",top:"Stol, 2236 m"},
  C1:{d:"Advanced course, level C1",top:"Triglav, 2864 m"},
  FAM:{d:"Phrases for visiting the family",top:"Babičina kuhinja"}
};
const LEVELS=["A1","A2","B1","B2","C1","FAM"];
const lvName=l=>l==="FAM"?"Family":l;
const lvTitle=l=>l==="FAM"?"Family phrases":"Slovenian "+l;let lvl=(()=>{try{const l=localStorage.getItem("lipa-level");if(l&&LV[l])return l}catch(e){}return"A1"})();
let C=LV[lvl];
const KL=(l,ci,li)=>(l==="A1"?"":l+":")+ci+"-"+li;
const K=(ci,li)=>KL(lvl,ci,li);
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
 slow:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 story:'<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
 game:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 back:'<path d="m15 18-6-6 6-6"/>'
};
const icon=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const LEAF='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21C6.5 17.6 3.5 13.8 3.5 9.9A4.4 4.4 0 0 1 12 8a4.4 4.4 0 0 1 8.5 1.9c0 3.9-3 7.7-8.5 11.1z"/></svg>';
const $=s=>document.querySelector(s);
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const uniq=a=>[...new Set(a)];
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const norm=s=>s.toLowerCase().replace(/\.\.\./g," ").replace(/[.,!?…"„“”:;()]/g,"").replace(/\s+/g," ").trim();
const plain=s=>norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const CW=(l,ci)=>LV[l][ci].v.map(s=>{const[sl,en]=s.split("|");return{sl,en,ci,lv:l}});
const W=ci=>CW(lvl,ci);
const ALLW=()=>C.flatMap((c,i)=>W(i));
const half=ci=>Math.ceil(C[ci].v.length/2);
const toks=s=>s.split(" ");
const clean=t=>t.replace(/[.,!?…]/g,"");

/* ---------------- progress (saved in this browser) ---------------- */
const KEY="lipa-sl-a1";
const def=()=>({done:{},xp:0,streak:0,last:null,day:null,dayXp:0,goal:30,days:{},srs:{},stories:{},best:{}});
let S=(()=>{try{const r=localStorage.getItem(KEY);if(r)return Object.assign(def(),JSON.parse(r))}catch(e){}return def()})();
if(S.day&&S.dayXp&&!S.days[S.day])S.days[S.day]=S.dayXp;
const saveLocal=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const save=()=>{S.t=Date.now();S.lvl=lvl;saveLocal();if(window.LipaCloud)LipaCloud.push()};
const today=()=>new Date().toLocaleDateString("sv");
const yday=()=>{const d=new Date();d.setDate(d.getDate()-1);return d.toLocaleDateString("sv")};
const chDone=ci=>LN.filter((_,li)=>S.done[K(ci,li)]).length;
const totalDone=()=>C.reduce((n,_,ci)=>n+chDone(ci),0);
const nextLesson=()=>{for(let ci=0;ci<C.length;ci++)for(let li=0;li<5;li++)if(!S.done[K(ci,li)])return[ci,li];return null};
const learned=()=>C.reduce((n,c,ci)=>n+(S.done[K(ci,0)]?half(ci):0)+(S.done[K(ci,1)]?c.v.length-half(ci):0),0);
const totalW=()=>C.reduce((n,c)=>n+c.v.length,0);
const NL=()=>C.length*5;
const dayXp=()=>(S.days&&S.days[today()])||(S.day===today()?S.dayXp:0);
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toLocaleDateString("sv")};
const weekStart=()=>{const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));return d.toLocaleDateString("sv")};
const weekXp=days=>{const w=weekStart();return Object.entries(days||{}).reduce((n,[d,x])=>d>=w?n+x:n,0)};
const dispStreak=()=>S.last===today()||S.last===yday()?S.streak:0;
const fullCh=l=>LV[l]?LV[l].reduce((n,_,ci)=>n+(LN.every((_,li)=>S.done[KL(l,ci,li)])?1:0),0):0;
function gainXp(xp){
  const t=today();if(S.day!==t){S.day=t;S.dayXp=0}
  S.dayXp+=xp;S.xp+=xp;S.days[t]=(S.days[t]||0)+xp;
  const old=addDays(-70);for(const d in S.days)if(d<old)delete S.days[d];
  if(S.last!==t){S.streak=S.last===yday()?S.streak+1:1;S.last=t}
  save();
}

/* ---------------- spaced repetition: each word gets a box (0-7) and a due date ---------------- */
const INT=[0,1,2,4,8,16,35,70];
function srsSeen(w){if(!w||S.srs[w.sl])return;S.srs[w.sl]={b:1,due:addDays(1),lv:w.lv,ci:w.ci,en:w.en,t:Date.now()}}
function srsMark(w,ok){if(!w)return;const e=S.srs[w.sl]||{b:0,lv:w.lv,ci:w.ci,en:w.en};
  e.b=ok?Math.min(e.b+1,7):1;e.due=ok?addDays(INT[e.b]):today();e.t=Date.now();S.srs[w.sl]=e}
const srsDue=()=>{const t=today();return Object.entries(S.srs).filter(([_,e])=>e.due<=t&&LV[e.lv]&&LV[e.lv][e.ci])};
const strength=sl=>{const e=S.srs[sl];if(!e)return"";return e.b>=6?"strong":e.b>=4?"mid":"weak"};
try{const th=localStorage.getItem("lipa-theme");if(th)document.documentElement.dataset.theme=th}catch(e){}

/* ---------------- audio ---------------- */
let voice=null,warned=false;
const hasTTS="speechSynthesis" in window;
function pickVoice(){const vs=speechSynthesis.getVoices();const by=re=>vs.filter(v=>re.test(v.lang)).sort((a,b)=>/natural|online/i.test(b.name)-/natural|online/i.test(a.name))[0];voice=by(/^sl/i)||by(/^hr/i)||by(/^bs/i)||by(/^sr/i)||by(/^cs/i)||by(/^sk/i)||by(/^pl/i)||null}
if(hasTTS){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
function say(t,cb){
  if(!hasTTS){cb&&cb();return}
  if((!voice||!/^sl/i.test(voice.lang))&&!warned){warned=true;toast("No Slovenian voice on this device, so audio may sound off. Microsoft Edge has good Slovenian voices built in.")}
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
const NAV={learn:["Learn","mount"],review:["Review","review"],stories:["Stories","story"],play:["Play","game"],words:["Words","book"],us:["Us","heart"]};
let storyAt=null;
function renderNav(){document.querySelectorAll(".nl").forEach(b=>{const[n,i]=NAV[b.dataset.view];b.innerHTML=icon(i,22)+`<span>${n}</span>`;b.toggleAttribute("aria-current",b.dataset.view===view);if(b.dataset.view===view)b.setAttribute("aria-current","page")})}
function stats(){
  const st=dispStreak(),dx=dayXp(),pct=Math.min(100,Math.round(dx/S.goal*100)),done=totalDone();
  $("#rail").innerHTML=`
  <div class="panel streak"><div class="num">${st}</div><div><h3>Day streak</h3><p>${st?"Keep it going with a lesson today.":"Finish a lesson to start one."}</p></div></div>
  <div class="panel goal"><div class="ring" style="--p:${pct}"><span>${pct}%</span></div><div><h3>Daily goal</h3><p>${dx} of ${S.goal} XP today</p></div></div>
  <div class="panel"><h3>${lvTitle(lvl)}</h3><div class="meter"><i style="width:${done/NL()*100}%"></i></div><p>${done} of ${NL()} lessons done</p><p>${learned()} of ${totalW()} words learned</p></div>
  <div class="panel"><h3>${S.xp} XP</h3><p>Total points earned</p></div>${window.LipaCloud?LipaCloud.railHTML():""}`;
  return `<div class="mstats"><span class="chip">Streak <b>${st}</b></span><span class="chip">Today <b>${dx}/${S.goal}</b> XP</span><span class="chip">${lvName(lvl)} <b>${done}</b>/${NL()} lessons</span></div>`;
}
function render(){
  renderNav();const ms=stats();const m=$("#main");
  if(view==="learn")m.innerHTML=ms+learnHTML();
  if(view==="words")m.innerHTML=ms+wordsHTML();
  if(view==="review")m.innerHTML=ms+reviewHTML();
  if(view==="stories")m.innerHTML=storyAt?storyHTML():ms+storiesHTML();
  if(view==="play")m.innerHTML=LipaGame.html();
  if(view==="us")m.innerHTML=LipaCloud.html();
}
function learnHTML(){
  const nx=nextLesson();
  if(nx&&!openCh.size)openCh.add(nx[0]);
  const hero=nx?`<section class="hero"><div class="leaf">${LEAF}</div>
    <p class="meta">Chapter ${nx[0]+1}, ${lname(nx[0],nx[1]).toLowerCase()}</p>
    <h2 class="sl">${C[nx[0]].t}</h2><p class="en">${C[nx[0]].e}</p>
    <button class="btn" data-start="${nx[0]}-${nx[1]}">${totalDone()?"Continue lesson":"Start your first lesson"}</button></section>`
   :`<section class="hero"><div class="leaf">${LEAF}</div><p class="meta">Course complete</p><h2 class="sl">Čestitke!</h2><p class="en">Congratulations, you've finished ${lvTitle(lvl)}. Keep your words fresh in Review.</p><button class="btn" data-view="review">Go to review</button></section>`;
  const tabs=LEVELS.map(l=>`<button class="tab${l==="FAM"?" fam":""}" role="tab" aria-selected="${l===lvl}" ${LV[l]?`data-lvl="${l}"`:'disabled title="Coming soon"'}>${l==="FAM"?"👵 ":""}${lvName(l)}</button>`).join("");
  const chs=C.map((c,ci)=>{
    const d=chDone(ci),p=d/5*100,cls=d===5?"full":d?"part":"";
    const rows=LN.map((l,li)=>{const k=ci+"-"+li,ok=S.done[K(ci,li)];return`<li><button class="lrow ${ok?"done":""}" data-start="${k}"><span class="lic">${icon(ok?"check":licon(ci,li))}</span><span class="nm">${lname(ci,li)}</span><span class="st">${ok?"Done":"Start"}</span></button></li>`}).join("");
    return`<li class="ch ${openCh.has(ci)?"open":""}"><div class="node ${cls}" style="--p:${p}"><span>${d===5?icon("check",18):ci+1}</span></div>
      <button class="chhead" data-ch="${ci}" aria-expanded="${openCh.has(ci)}"><span><h3>${c.t}</h3><span class="en">${c.e}</span></span><span class="cnt">${d} of 5</span><span class="chev">${icon("chev")}</span></button>
      <ul class="lessons">${rows}</ul></li>`}).join("");
  return`<header class="lvl"><div><h1>${lvl==="FAM"?"Family":"Slovenian"}</h1><p>${LVINFO[lvl].d}</p></div><div class="tabs" role="tablist">${tabs}</div></header>${hero}
   <ol class="trail">${chs}<li class="summit"><div class="node"><span>${icon("mount",22)}</span></div><h3>${LVINFO[lvl].top}</h3><p>Finish all ${C.length} chapters to reach the ${lvName(lvl)} summit.</p></li></ol>`;
}
function wordsHTML(){
  const sec=C.map((c,ci)=>{const h=half(ci);return`<section class="wsec" data-sec><h2>${c.t}<small>${c.e}</small></h2><div class="wlist">${W(ci).map((w,i)=>{const on=S.done[K(ci,i<h?0:1)],sg=strength(w.sl)||(on?"weak":"");return`<div class="wrow" data-w="${esc((w.sl+" "+w.en).toLowerCase())}"><span class="dot ${sg}" title="${{strong:"Strong",mid:"Getting there",weak:"Still learning"}[sg]||"Not learned yet"}"></span><span class="s">${w.sl}</span><span class="e">${w.en}</span>${sayBtn(w.sl)}</div>`}).join("")}</div></section>`}).join("");
  const note=hasTTS&&!(voice&&/^sl/i.test(voice.lang))?`<p class="note">Your device has no Slovenian voice, so audio uses a fallback. The easiest fix is to open Lipa in Microsoft Edge, which has natural Slovenian voices built in.</p>`:"";
  return`<header class="ph"><h1>Words</h1><p>All ${totalW()} words from the ${lvl} course. The dot shows how well you know each word: <span class="dot weak"></span> still learning, <span class="dot mid"></span> getting there, <span class="dot strong"></span> strong.</p><input class="search" type="search" placeholder="Search in Slovenian or English" data-search aria-label="Search words">${note}</header>${sec}`;
}
function reviewHTML(){
  const due=srsDue().length,all=Object.values(S.srs),n=k=>all.filter(e=>k==="strong"?e.b>=6:k==="mid"?e.b>=4&&e.b<6:e.b<4).length;
  const tot=Math.max(1,all.length),sw=n("weak"),sm=n("mid"),ss=n("strong");
  return`<header class="ph"><h1>Review</h1><p>Words come back just before you'd forget them. The better you know a word, the longer it waits.</p></header>
  <div class="revcard"><h2>${due?`${due} word${due>1?"s":""} to review today`:all.length?"All caught up! 🎉":"Nothing to review yet"}</h2>
  <p>${due?"A short session of up to 14 words, weakest first.":all.length?"Come back tomorrow, or practise anyway with words from your chapters.":"Finish a lesson with new words and they'll start showing up here."}</p>
  ${all.length?`<div class="sbar"><i class="weak" style="width:${sw/tot*100}%"></i><i class="mid" style="width:${sm/tot*100}%"></i><i class="strong" style="width:${ss/tot*100}%"></i></div><p class="slegend"><span><span class="dot weak"></span>${sw} still learning</span><span><span class="dot mid"></span>${sm} getting there</span><span><span class="dot strong"></span>${ss} strong</span></p>`:""}
  <button class="btn" data-act="review">${due?"Start review":"Practise anyway"}</button></div>`;
}

/* ---------------- stories ---------------- */
function storiesHTML(){
  const order=[lvl,...LEVELS.filter(l=>l!==lvl)].filter(l=>window.LIPA_STORIES&&LIPA_STORIES[l]);
  return`<header class="ph"><h1>Stories</h1><p>One story per level, with the same characters. A new part unlocks as you finish chapters.</p></header>`+order.map(l=>{const st=LIPA_STORIES[l],f=fullCh(l);
   return`<section class="wsec"><h2>${st.t}<small>${lvName(l)} · ${st.e}</small></h2><div class="slist">${st.parts.map((p,i)=>{const open=f>=p.u,read=S.stories[l+":"+i];
    return open?`<button class="spart ${read?"read":""}" data-story="${l}:${i}"><span class="lic">${icon(read?"check":"story")}</span><span><b>${i+1}. ${p.t}</b><span class="e">${p.e}</span></span></button>`
     :`<div class="spart locked"><span class="lic">${icon("lock")}</span><span><b>${i+1}. ${p.t}</b><span class="e">Finish ${p.u} chapter${p.u>1?"s":""} of ${lvName(l)} to unlock (${f}/${p.u})</span></span></div>`}).join("")}</div></section>`}).join("");
}
function storyHTML(){
  const[l,i]=storyAt,st=LIPA_STORIES[l],p=st.parts[i],nx=st.parts[i+1],read=S.stories[l+":"+i];
  return`<button class="ghost" data-act="sback">${icon("back",18)} All stories</button>
  <header class="ph sh"><p class="q">${st.t} · part ${i+1} of ${st.parts.length}</p><h1>${p.t}</h1><p>${p.e}</p></header>
  <button class="ghost" data-act="splay">${icon("sound",18)} Read it to me</button>
  <div class="story">${p.p.map(x=>`<div class="sline"><button class="bub" data-bub><div class="s">${x[0]}</div><div class="e">${x[1]}</div></button>${sayBtn(x[0])}</div>`).join("")}</div>
  <p class="hint">Tap a sentence to see the translation.</p>
  ${read?`<p class="cwin">You've read this part.</p>`:`<button class="btn" data-act="sdone">I've read it (+5 XP)</button>`}
  ${nx?(fullCh(l)>=nx.u?` <button class="ghost" data-story="${l}:${i+1}">Next part ${icon("chev",16)}</button>`:`<p class="hint">Part ${i+2} unlocks after ${nx.u} chapters of ${lvName(l)}.</p>`):""}`;
}

/* ---------------- exercise builders ---------------- */
function pool(w){const L2=LV[w.lv];return CW(w.lv,w.ci).concat(CW(w.lv,w.ci>0?w.ci-1:Math.min(1,L2.length-1)))}
function mcStep(ci,w,dir){
  const toEn=dir==="sl",key=toEn?"en":"sl";
  const o=uniq([w[key],...sh(pool(w).map(x=>x[key]).filter(x=>x!==w[key]))]).slice(0,4);
  return{k:"mc",q:toEn?"Choose the meaning":"Choose the Slovenian",big:toEn?w.sl:w.en,bigSay:toEn,o:sh(o),a:w[key],say:w.sl,wo:w};
}
const typeStep=w=>({k:"type",big:w.en,a:[w.sl],say:w.sl,wo:w});
const listenWord=w=>({k:"listen",a:[w.sl],hint:w.en,say:w.sl,wo:w});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const speakStep=line=>SR?{k:"speak",a:line[1],hint:line[2],say:line[1]}:null;
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
    const spk=ord.length?speakStep(d[ord[ord.length-1]]):null;
    return[{k:"dialog",d},gapStep(d[idx[0]],all),lst,ord[0]!=null?orderStep(d[ord[0]]):null,gapStep(d[idx[1]],all),spk,ord[1]!=null?orderStep(d[ord[1]]):null,meaningStep(d,idx[2])].filter(Boolean);
  }
  if(li===3)return[{k:"gram",g:c.g},...c.g.q.map(drill)];
  const r=sh(ws);
  if(c.r){
    const rq=c.r.q.map(q=>({k:"mc",plainQ:true,q:q.p,o:sh(q.o),a:q.o[0],ctx:c.r.x}));
    const mix=sh([mcStep(ci,r[0],"sl"),mcStep(ci,r[1],"en"),listenWord(r[2]),typeStep(r[3]),...sh(c.g.q).slice(0,2).map(drill)]);
    return[{k:"read",r:c.r},...rq,...mix,...(c.w?[{k:"write",w:c.w}]:[])];
  }
  const st=[...r.slice(0,4).map((w,i)=>mcStep(ci,w,i%2?"en":"sl")),...r.slice(4,7).map(typeStep),...sh(c.g.q).slice(0,2).map(drill)];
  const ol=c.d.filter(x=>{const n=toks(x[1]).length;return n>=3&&n<=8});if(ol.length)st.push(orderStep(sh(ol)[0]));
  const out=sh(st);out.splice(4,0,matchStep(r.slice(7,12).length>=4?r.slice(7,12):r.slice(0,5)));return out;
}
function buildReview(){
  let items=sh(srsDue()).sort((a,b)=>a[1].b-b[1].b).slice(0,14).map(([sl,e])=>({sl,en:e.en,ci:e.ci,lv:e.lv}));
  if(items.length<10){
    let chs=C.map((_,i)=>i).filter(i=>chDone(i));if(!chs.length)chs=[0];
    const have=new Set(items.map(x=>x.sl));
    items=items.concat(sh(chs.flatMap(ci=>W(ci))).filter(w=>!have.has(w.sl)).slice(0,10-items.length));
  }
  items=sh(items);
  const st=items.map((w,i)=>i%4===3?typeStep(w):i%5===4?listenWord(w):mcStep(w.ci,w,i%2?"en":"sl"));
  const rest=sh(items).slice(0,5);if(rest.length>=4)st.splice(Math.min(5,st.length),0,matchStep(rest));
  return st;
}

/* ---------------- lesson player ---------------- */
let L=null;
const PRAISE=["Odlično!","Bravo!","Tako je!","Super!","Zelo dobro!"];
function startLesson(ci,li,steps){
  L={ci,li,steps:steps||buildLesson(ci,li),i:0,correct:0,wrong:0,finished:false,lv:lvl};
  $("#lesson").classList.add("on");document.body.style.overflow="hidden";renderStep();
}
function closeLesson(){if(hasTTS)speechSynthesis.cancel();stopRec();$("#lesson").classList.remove("on");document.body.style.overflow="";L=null;render()}
function foot(mode,msg){
  L.mode=mode;const f=$("#lfoot");f.className="lfoot"+(mode==="good"?" good":mode==="bad"?" bad":"");
  $("#fb").innerHTML=msg||"";const g=$("#go");g.textContent=mode==="check"?"Check":"Continue";
  g.disabled=mode==="check"||mode==="wait";
}
const enable=()=>{$("#go").disabled=false};
function renderStep(){
  stopRec();const s=L.steps[L.i];L.wrote=false;L.sel=null;L.ord=[];L.m={l:null,ok:0,miss:0,bad:new Set()};L.tries=0;
  $("#barfill").style.width=(L.i/L.steps.length*100)+"%";
  const st=$("#stage");st.className="stage";st.innerHTML=R[s.k](s);
  $(".lbody").scrollTop=0;
  if(s.k==="card"){foot("next");say(s.w.sl);srsSeen(s.w)}
  else if(s.k==="speak")foot("wait");
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
  speak:s=>`<p class="q">Say it out loud</p><div class="big long">${s.a} ${sayBtn(s.a)}</div><p class="hint">${s.hint}</p><div class="micwrap"><button class="mic" data-mic aria-label="Start speaking">${icon("mic",34)}</button></div><p class="heard" id="heard">Tap the microphone, then read the sentence.</p><p class="hint micnote">Your browser sends the recording to its speech service to check it. Works best in Chrome or Edge with internet.</p><button class="ghost" data-act="skipspeak">I can't speak right now</button>`,
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
  if(!s.re&&s.wo)srsMark(s.wo,ok);
  if(ok){L.correct++;foot("good",`<strong>${PRAISE[Math.random()*PRAISE.length|0]}</strong>${extra}`)}
  else{L.wrong++;if(!s.re)L.steps.push(Object.assign({},s,{re:true,o:s.o?sh(s.o):undefined,tiles:s.tiles?sh(s.tiles):undefined}));foot("bad",`<strong>Not quite</strong>Correct answer: ${answerText(s)}`)}
  if(s.say)say(s.say);
}
/* ---------------- speaking ---------------- */
let rec=null;
function stopRec(){if(rec){try{rec.abort()}catch(e){}rec=null}const m=$(".mic");m&&m.classList.remove("on")}
const lev=(a,b)=>{const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]};
const simil=(a,b)=>{a=plain(a);b=plain(b);return 1-lev(a,b)/Math.max(1,a.length,b.length)};
function listenSpeak(){
  if(!SR||!L)return;stopRec();const s=L.steps[L.i],hd=$("#heard");
  rec=new SR();rec.lang="sl-SI";rec.interimResults=false;rec.maxAlternatives=4;
  $(".mic").classList.add("on");hd.textContent="Listening …";
  rec.onresult=ev=>{const alts=[...ev.results[0]].map(r=>r.transcript),best=alts.reduce((b,x)=>simil(x,s.a)>simil(b,s.a)?x:b,alts[0]),sc=simil(best,s.a);
    stopRec();L.tries++;
    if(sc>=.72){L.correct++;$("#stage").classList.add("locked");hd.innerHTML=`I heard: <b>${esc(best)}</b>`;foot("good",`<strong>${PRAISE[Math.random()*PRAISE.length|0]}</strong>Clear as a bell.`);say(s.a)}
    else if(L.tries<3){hd.innerHTML=`I heard: <b>${esc(best)}</b>. Listen once more and try again (${3-L.tries} left).`}
    else{L.wrong++;$("#stage").classList.add("locked");hd.innerHTML=`I heard: <b>${esc(best)}</b>`;foot("bad",`<strong>Keep practising</strong>Listen to it once more and repeat it out loud.`);say(s.a)}};
  rec.onerror=ev=>{stopRec();hd.textContent={"not-allowed":"The microphone is blocked. Allow it in the browser's address bar, or skip this one.","no-speech":"I didn't hear anything. Tap and try again.","network":"Speech checking needs an internet connection. You can skip this one.","service-not-allowed":"This browser doesn't allow speech checking. You can skip this one."}[ev.error]||"Something went wrong with the microphone. Try again or skip."};
  rec.onend=()=>{const m=$(".mic");m&&m.classList.remove("on")};
  try{rec.start()}catch(e){stopRec()}
}
function next(){
  if(L.finished){closeLesson();return}
  L.i++;if(L.i>=L.steps.length)finish();else renderStep();
}
function finish(){
  const isReview=L.ci==null,key=KL(L.lv,L.ci,L.li);
  if(!isReview)S.done[key]=true;
  const xp=L.correct+(isReview?3:5);
  gainXp(xp);
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
  const lv=t.closest("[data-lvl]");if(lv){lvl=lv.dataset.lvl;C=LV[lvl];openCh.clear();try{localStorage.setItem("lipa-level",lvl)}catch(e){}S.lvl=lvl;render();return}
  const v=t.closest("[data-view]");if(v){if(view==="play"&&v.dataset.view!=="play")LipaGame.stop();view=v.dataset.view;if(view==="stories")storyAt=null;render();window.scrollTo(0,0);return}
  const so=t.closest("[data-story]");if(so){const[l,i]=so.dataset.story.split(":");storyAt=[l,+i];view="stories";render();window.scrollTo(0,0);return}
  const stt=t.closest("[data-start]");if(stt){const[ci,li]=stt.dataset.start.split("-").map(Number);startLesson(ci,li);return}
  const ch=t.closest("[data-ch]");if(ch){const ci=+ch.dataset.ch;openCh.has(ci)?openCh.delete(ci):openCh.add(ci);render();return}
  const a=t.closest("[data-act]");
  if(a){const act=a.dataset.act;
    if(act==="close")closeLesson();
    if(act==="skipspeak"&&L){stopRec();$("#stage").classList.add("locked");foot("next","<strong>Skipped</strong>No problem, next time.")}
    if(act==="sback"){storyAt=null;render();window.scrollTo(0,0)}
    if(act==="sdone"&&storyAt){S.stories[storyAt[0]+":"+storyAt[1]]=1;gainXp(5);render()}
    if(act==="splay"&&storyAt){const p=LIPA_STORIES[storyAt[0]].parts[storyAt[1]].p;let i=0;const bubs=document.querySelectorAll(".story [data-bub]");const go=()=>{if(view!=="stories"||!storyAt||i>=p.length)return;bubs[i]&&bubs[i].classList.add("show");say(p[i][0],()=>{i++;setTimeout(go,350)})};go()}
    if(act==="model"){$("#model").classList.add("show");if(L)wdone()}
    if(act==="copy"){const v=($("#wr")||{}).value||"";try{navigator.clipboard.writeText(v).then(()=>toast("Copied. Paste it into a message to a native speaker."),()=>toast("Select the text and copy it manually."))}catch(e){toast("Select the text and copy it manually.")}}
    if(act==="review")startLesson(null,null,buildReview());
    if(act==="theme"){const cur=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");const n=cur==="dark"?"light":"dark";document.documentElement.dataset.theme=n;try{localStorage.setItem("lipa-theme",n)}catch(e){}}
    if(act==="reset"){if(a.dataset.arm){S=def();save();openCh.clear();a.textContent="Reset progress";delete a.dataset.arm;render()}else{a.dataset.arm=1;a.textContent="Tap again to reset";setTimeout(()=>{if(a.dataset.arm){delete a.dataset.arm;a.textContent="Reset progress"}},3000)}}
    if(act==="playall"&&L){const d=L.steps[L.i].d;let i=0;const bubs=document.querySelectorAll("[data-bub]");const go=()=>{if(!L||i>=d.length)return;bubs[i]&&bubs[i].classList.add("show");say(d[i][1],()=>{i++;setTimeout(go,350)})};go()}
    return}
  if(!L){const bb=t.closest("[data-bub]");if(bb)bb.classList.toggle("show");return}
  if(L.mode==="good"||L.mode==="bad")return;
  const s=L.steps[L.i];
  if(t.closest("[data-mic]")){listenSpeak();return}
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
      else{L.m.miss++;L.m.bad.add(L.m.l);L.m.bad.add(L.m.r);[le,re].forEach(b=>{b.classList.add("no");setTimeout(()=>b.classList.remove("no","sel"),450)})}
      le.classList.remove("sel");re.classList.remove("sel");L.m.l=L.m.r=null;
      if(L.m.ok===s.ws.length){s.ws.forEach((w,i)=>srsMark(w,!L.m.bad.has(i)));L.correct++;foot("good",`<strong>${PRAISE[Math.random()*PRAISE.length|0]}</strong>${L.m.miss?"All pairs matched.":"All pairs matched on the first try."}`)}
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
if(window.LipaCloud)LipaCloud.init();
