/* Lipa: oblak (Supabase). Prijava, napredek na vseh napravah in "Midva" (izzivi za dva).
   Nastavitve so v js/config.js. Brez njih stran deluje kot prej, samo v tem brskalniku. */
window.LipaCloud = (function(){
 const cfg=window.LIPA_CONFIG||{};
 const on=!!(cfg.supabaseUrl&&cfg.supabaseKey&&window.supabase);
 const sb=on?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey):null;
 let user=null,me=null,partner=null,pdata=null,cheers=[],status="",mode="login",editGoal=false,pushT=null,busy=false;

 function merge(a,b){
  a=a||{};b=b||{};const o=Object.assign({},b,a);
  o.done=Object.assign({},b.done,a.done);
  o.xp=Math.max(a.xp||0,b.xp||0);
  o.days=Object.assign({},b.days);for(const k in a.days||{})o.days[k]=Math.max(o.days[k]||0,a.days[k]);
  o.srs=Object.assign({},b.srs);for(const k in a.srs||{})if(!o.srs[k]||(a.srs[k].t||0)>=(o.srs[k].t||0))o.srs[k]=a.srs[k];
  o.stories=Object.assign({},b.stories,a.stories);
  o.best={};for(const k of new Set([...Object.keys(a.best||{}),...Object.keys(b.best||{})]))o.best[k]=Math.max((a.best||{})[k]||0,(b.best||{})[k]||0);
  const al=a.last||"",bl=b.last||"";
  if(bl>al){o.last=bl;o.streak=b.streak}else if(al>bl){o.last=al;o.streak=a.streak}else{o.last=al||null;o.streak=Math.max(a.streak||0,b.streak||0)}
  const t=today();o.day=t;o.dayXp=o.days[t]||0;
  return o;
 }
 async function pull(){
  const {data,error}=await sb.from("progress").select("data").eq("user_id",user.id).maybeSingle();
  if(error){status="Couldn't sync: "+error.message;return}
  if(data&&data.data){S=Object.assign(def(),merge(S,data.data));saveLocal()}
  await pushNow();
 }
 async function pushNow(){
  if(!user)return;
  const {error}=await sb.from("progress").upsert({user_id:user.id,data:S,updated_at:new Date().toISOString()});
  status=error?"Couldn't sync: "+error.message:"Synced "+new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  const st=document.getElementById("cstatus");if(st)st.textContent=status;
 }
 function push(){if(!user)return;clearTimeout(pushT);pushT=setTimeout(pushNow,1500)}
 async function loadMe(){
  const {data}=await sb.from("profiles").select("*").eq("id",user.id).maybeSingle();me=data;
  partner=null;pdata=null;
  if(me&&me.partner){
   const [p,pr]=await Promise.all([sb.from("profiles").select("*").eq("id",me.partner).maybeSingle(),sb.from("progress").select("data,updated_at").eq("user_id",me.partner).maybeSingle()]);
   partner=p.data;pdata=pr.data?pr.data.data:null;if(pdata)pdata._at=pr.data.updated_at;
  }
  const {data:ch}=await sb.from("cheers").select("*").or(`to_id.eq.${user.id},from_id.eq.${user.id}`).order("created_at",{ascending:false}).limit(12);
  cheers=ch||[];
  const fresh=cheers.filter(c=>c.to_id===user.id&&!c.seen);
  if(fresh.length){fresh.slice().reverse().forEach((c,i)=>setTimeout(()=>toast(`${c.emoji||"💛"} ${partner?partner.name:"Your partner"}: ${c.msg||""}`),i*4000));
   await sb.from("cheers").update({seen:true}).in("id",fresh.map(c=>c.id))}
 }
 async function refresh(){if(!user||busy)return;busy=true;try{await pull();await loadMe()}finally{busy=false}if(!L&&view!=="play")render()}
 async function init(){
  if(!on)return;
  sb.auth.onAuthStateChange((ev,ses)=>{
   const u=ses&&ses.user;
   if(u&&(!user||user.id!==u.id)){user=u;refresh()}
   if(!u&&user){user=null;me=partner=pdata=null;cheers=[];if(!L)render()}
  });
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")refresh()});
  setInterval(()=>{if(document.visibilityState==="visible")refresh()},90000);
 }
 const val=id=>(document.getElementById(id)||{}).value||"";
 async function act(a,el){
  try{
  if(a==="mode"){mode=el.dataset.m;status="";render();return}
  if(a==="login"||a==="signup"){
   const email=val("cemail").trim(),pw=val("cpw"),name=val("cname").trim();
   if(!email||pw.length<6){status="Enter your e-mail and a password of at least 6 characters.";render();return}
   if(a==="signup"&&!name){status="Tell us your name first.";render();return}
   status="One moment …";render();
   const r=a==="login"?await sb.auth.signInWithPassword({email,password:pw}):await sb.auth.signUp({email,password:pw,options:{data:{name}}});
   if(r.error){status=r.error.message;render();return}
   if(a==="signup"&&!r.data.session){status="Almost done: open the e-mail we sent you, confirm, then log in here.";mode="login";render();return}
   status="";return}
  if(a==="logout"){await pushNow();await sb.auth.signOut();return}
  if(a==="link"){const c=val("ccode").trim().toUpperCase();if(!c)return;const {data,error}=await sb.rpc("link_partner",{c});if(error){toast(error.message);return}toast(`Connected with ${data}! 💛`);await loadMe();render();return}
  if(a==="unlink"){if(!el.dataset.arm){el.dataset.arm=1;el.textContent="Tap again to disconnect";return}await sb.rpc("unlink_partner");await loadMe();render();return}
  if(a==="editgoal"){editGoal=!editGoal;render();return}
  if(a==="savegoal"){const g=Math.max(10,parseInt(val("cgoal"))||150),r=val("creward").trim();const {error}=await sb.rpc("set_pair_goal",{g,r});if(error){toast(error.message);return}editGoal=false;await loadMe();render();return}
  if(a==="cheer"){const msg=el.dataset.msg||val("cmsg").trim(),emoji=el.dataset.emoji||"💛";if(!me||!me.partner)return;
   const {error}=await sb.from("cheers").insert({from_id:user.id,to_id:me.partner,emoji,msg});
   if(error){toast(error.message);return}toast(`Sent ${emoji} to ${partner?partner.name:"your partner"}`);await loadMe();render();return}
  if(a==="name"){const n=val("cmyname").trim();if(n){await sb.from("profiles").update({name:n}).eq("id",user.id);await loadMe();render()}return}
  }catch(e){toast("Something went wrong: "+e.message)}
 }
 document.addEventListener("click",e=>{const b=e.target.closest("[data-cloud]");if(b){e.preventDefault();act(b.dataset.cloud,b)}});
 document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.closest&&e.target.closest(".cform")){e.preventDefault();const b=document.querySelector(".cform [data-primary]");b&&b.click()}});

 const ago=d=>{if(!d)return"not yet";if(d===today())return"today";if(d===yday())return"yesterday";const n=Math.round((new Date(today())-new Date(d))/864e5);return n+" days ago"};
 const pStreak=p=>p&&(p.last===today()||p.last===yday())?p.streak||0:0;
 const pToday=p=>p&&p.days?p.days[today()]||0:0;
 function pair(){const mine=weekXp(S.days),theirs=weekXp(pdata&&pdata.days),goal=(me&&me.goal)||150;return{mine,theirs,goal,pct:Math.min(100,Math.round((mine+theirs)/goal*100))}}

 function html(){
  if(!on)return`<header class="ph"><h1>Us</h1><p>Learn together: progress on every device, a shared weekly goal and cheers for each other.</p></header><div class="ccard"><h2>Not connected yet</h2><p>This needs a free Supabase project. Once its address and key are pasted into <b>js/config.js</b>, logging in appears here. Until then, progress is saved in this browser only.</p></div>`;
  if(!user){const su=mode==="signup";return`<header class="ph"><h1>Us</h1><p>Log in so your progress follows you to every device, and connect with your partner.</p></header>
   <div class="ccard cform"><div class="tabs"><button class="tab" aria-selected="${!su}" data-cloud="mode" data-m="login">Log in</button><button class="tab" aria-selected="${su}" data-cloud="mode" data-m="signup">Create account</button></div>
   ${su?`<label>Your name<input id="cname" class="search" autocomplete="given-name"></label>`:""}
   <label>E-mail<input id="cemail" class="search" type="email" autocomplete="email"></label>
   <label>Password<input id="cpw" class="search" type="password" autocomplete="${su?"new-password":"current-password"}"></label>
   <button class="btn" data-primary data-cloud="${su?"signup":"login"}">${su?"Create account":"Log in"}</button>${status?`<p class="cmsg">${esc(status)}</p>`:""}</div>`}
  if(!me)return`<header class="ph"><h1>Us</h1></header><div class="ccard"><p>Loading …</p></div>`;
  const you=`<div class="ccard"><h2>${esc(me.name||"You")}</h2><p class="hint">${esc(user.email)}</p><p class="hint" id="cstatus">${esc(status)}</p><div class="crow"><input id="cmyname" class="search" placeholder="Change your name" aria-label="Your name"><button class="ghost" data-cloud="name">Save</button><button class="ghost" data-cloud="logout">Log out</button></div></div>`;
  if(!partner)return`<header class="ph"><h1>Us</h1><p>Connect with your partner to share a weekly goal and send each other cheers.</p></header>${you}
   <div class="ccard cform"><h2>Connect with your partner</h2><p>Your code: <span class="code">${esc(me.code)}</span></p><p class="hint">Give this code to your partner, or type theirs below.</p><div class="crow"><input id="ccode" class="search" placeholder="Partner's code" maxlength="8" autocapitalize="characters" aria-label="Partner's code"><button class="btn" data-primary data-cloud="link">Connect</button></div></div>`;
  const P=pair(),pd=pdata||{},nm=esc(partner.name||"Partner");
  const msgs=["Bravo! 👏","Super si! 💛","Še eno lekcijo? 😉","Tvoj streak te gleda 🔥","Dobro ti gre!"];
  return`<header class="ph"><h1>Us</h1><p>You and ${nm}, learning together.</p></header>
  <div class="cgrid">
   <div class="ccard cgoal"><h2>This week together</h2><div class="ring big" style="--p:${P.pct}"><span>${P.mine+P.theirs}<small>/ ${P.goal} XP</small></span></div>
    <div class="cbars"><div><span>You</span><div class="meter"><i style="width:${Math.min(100,P.mine/P.goal*100)}%"></i></div><b>${P.mine}</b></div><div><span>${nm}</span><div class="meter"><i class="p2" style="width:${Math.min(100,P.theirs/P.goal*100)}%"></i></div><b>${P.theirs}</b></div></div>
    <p class="creward">${me.reward?`🎁 <b>Reward:</b> ${esc(me.reward)}`:"No reward set yet. Make it worth it!"}</p>
    ${P.pct>=100?`<p class="cwin">Goal reached! 🎉 Time to collect.</p>`:""}
    ${editGoal?`<div class="cform"><label>Weekly goal (XP together)<input id="cgoal" class="search" type="number" min="10" value="${P.goal}"></label><label>Reward<input id="creward" class="search" value="${esc(me.reward||"")}" placeholder="e.g. dinner of the winner's choice"></label><button class="btn" data-primary data-cloud="savegoal">Save</button></div>`:`<button class="ghost" data-cloud="editgoal">Change goal or reward</button>`}
    <p class="hint">The week resets on Monday.</p></div>
   <div class="ccard"><h2>${nm}</h2><div class="cstats"><div><b>${pStreak(pd)}</b><span>day streak</span></div><div><b>${pToday(pd)}</b><span>XP today</span></div><div><b>${pd.xp||0}</b><span>XP total</span></div></div>
    <p class="hint">Last lesson: ${ago(pd.last)}${pd.lvl?` · learning ${pd.lvl==="FAM"?"family phrases":pd.lvl}`:""}</p>
    <h3>Send a cheer</h3><div class="cheers">${["💛","🔥","👏","🏔️","🥐"].map(x=>`<button class="say" data-cloud="cheer" data-emoji="${x}" data-msg="${x}" aria-label="Send ${x}">${x}</button>`).join("")}</div>
    <div class="cquick">${msgs.map(m=>`<button class="chip2" data-cloud="cheer" data-emoji="💛" data-msg="${esc(m)}">${esc(m)}</button>`).join("")}</div>
    <div class="crow cform"><input id="cmsg" class="search" placeholder="Write a message" maxlength="140" aria-label="Message"><button class="btn" data-primary data-cloud="cheer">Send</button></div></div>
   <div class="ccard"><h2>Messages</h2>${cheers.length?`<ul class="clist">${cheers.map(c=>`<li class="${c.from_id===user.id?"out":"in"}"><span>${esc(c.emoji||"")} ${esc(c.msg||"")}</span><small>${c.from_id===user.id?"you":nm} · ${new Date(c.created_at).toLocaleDateString()}</small></li>`).join("")}</ul>`:`<p class="hint">No messages yet.</p>`}</div>
  </div>${you}<p class="hint"><button class="ghost" data-cloud="unlink">Disconnect from ${nm}</button></p>`;
 }
 function railHTML(){
  if(!on)return"";
  if(!user)return`<div class="panel"><h3>Learn on every device</h3><p>Log in under Us to save progress in the cloud.</p><button class="ghost" data-view="us">Log in</button></div>`;
  if(!partner)return"";
  const P=pair();
  return`<div class="panel goal"><div class="ring" style="--p:${P.pct}"><span>${P.pct}%</span></div><div><h3>You + ${esc(partner.name||"partner")}</h3><p>${P.mine+P.theirs} of ${P.goal} XP this week</p></div></div>`;
 }
 return{init,push,pushNow,html,railHTML,merge,get on(){return on},get user(){return user}};
})();
