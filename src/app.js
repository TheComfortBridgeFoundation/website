(function(){
var D=JSON.parse(document.getElementById('site-data').textContent);
var T=D.content,R=D.resources,CONFIG=D.config,PHOTO=D.config.photos||{},LANGNAME=D.config.langNames,GAPSRC=D.config.gapSource,CHAPTERS=D.chapters,EVENTS=D.events||[],CMS=D.cms||{items:[]};
var CHEV='<svg class="chev" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
var ARR='<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var SRCH='<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 13l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var EXT=" target='_blank' rel='noopener'";
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function li(a){return a.map(function(x){return '<li>'+x+'</li>'}).join('')}
function tel(p){return p==='211'?'tel:211':'tel:'+p.replace(/\D/g,'')}
var lang="en",page="home",condSel="cancer",topic="all",onlyMine=false;
try{var s=localStorage.getItem('hospice-lang');if(s&&T[s])lang=s}catch(e){}
var qp=new URLSearchParams(location.search).get('lang');if(qp&&T[qp])lang=qp;

/* ---------- HOME ---------- */
function homeHTML(){
 var t=T[lang],S=t.site,h="";
 h+='<section class="hero" id="top"><div class="sun" aria-hidden="true"></div><div class="horizon" aria-hidden="true"></div><div class="wrap"><h1>'+t.hero.h1+'</h1><p class="lede">'+t.hero.lede+'</p>'+
  '<div class="hero-ctas"><a class="btn btn-solid" href="#what">'+S.heroCtas[0]+'</a><a class="btn btn-ghost" href="#/chapters/tri-valley">'+S.heroCtas[1]+'</a></div>'+
  '<div class="facts">'+S.facts.map(function(f){return '<div><b>'+f[0]+'</b><span>'+f[1]+'</span></div>'}).join('')+'</div>'+
  '<div class="paths"><p class="ask">'+t.hero.ask+'</p><div class="path-list">'+t.hero.paths.map(function(p){return '<a href="#'+p[0]+'"><span>'+p[1]+'<span class="sub">'+p[2]+'</span></span>'+ARR+'</a>'}).join('')+'</div></div></div></section>';
 var w=t.what;
 h+='<section class="block" id="what"><div class="wrap"><div class="intro"><h2>'+w.h+'</h2><p>'+w.p+'</p></div><div class="pillars">'+S.pillars.map(function(p){return '<div class="pillar"><h3>'+p[0]+'</h3><p>'+p[1]+'</p></div>'}).join('')+'</div><div class="two"><div><h3>'+w.teamH+'</h3><ul class="plain">'+li(w.team)+'</ul></div><div><h3>'+w.whereH+'</h3><p>'+w.whereP+'</p><div class="note"><p>'+w.note+'</p></div></div></div></div></section>';
 var G=t.extra.gap;
 h+='<section class="block" id="gap"><div class="wrap gap"><div><h2>'+G.h+'</h2><p class="gap-big"><b>'+G.big+'</b><span>'+G.bigL+'</span></p><p>'+G.p+'</p></div><figure class="bars"><figcaption>'+G.cap+'</figcaption>'+G.bars.map(function(b){return '<div class="gbar"><span class="bl">'+b[0]+'</span><span class="track"><span class="fill" style="width:'+b[1]+'%"></span></span><span class="bv">'+b[1]+'%</span></div>'}).join('')+'<p class="small" style="margin-top:.8rem"><a href="'+GAPSRC+'"'+EXT+'>'+G.src+'</a></p></figure></div></section>';
 var m=t.myths;
 h+='<section class="block tint" id="myths"><div class="wrap"><div class="intro"><h2>'+m.h+'</h2><p>'+m.p+'</p></div><div class="flips">'+m.items.map(function(x){return '<button type="button" class="flip" aria-pressed="false"><span class="inner"><span class="face front"><span class="tag" style="align-self:flex-start">'+m.tag+'</span><span class="q">'+x[0]+'</span><span class="hint">'+S.flipHint+'</span></span><span class="face back" aria-hidden="true"><span class="tag" style="align-self:flex-start">'+m.fact.replace(/[:：]$/,'')+'</span><span class="a">'+x[1]+'</span><span class="hint">'+S.flipBack+'</span></span></span></button>'}).join('')+'</div></div></section>';
 var Q=t.extra.quiz;
 h+='<section class="block" id="quiz"><div class="wrap"><div class="intro"><h2>'+Q.h+'</h2><p>'+Q.p+'</p></div><ol class="quiz" id="quizList">'+Q.qs.map(function(q,qi){return '<li class="qcard" data-q="'+qi+'"><fieldset><legend>'+q.q+'</legend><div class="opts">'+q.o.map(function(o,oi){return '<button type="button" class="opt" data-o="'+oi+'">'+o+'</button>'}).join('')+'</div><p class="qfb" aria-live="polite"></p></fieldset></li>'}).join('')+'</ol><div class="qscore"><p id="qScore" aria-live="polite"></p><button type="button" class="btn btn-ghost" id="qReset">'+Q.reset+'</button></div></div></section>';
 var p=t.pall;
 h+='<section class="block tint" id="palliative"><div class="wrap"><div class="intro"><h2>'+p.h+'</h2><p>'+p.p+'</p></div><div class="table-scroll"><table><thead><tr>'+p.cols.map(function(c,i){return '<th scope="col"'+(i===p.cols.length-1?' class="hl"':'')+'>'+c+'</th>'}).join('')+'</tr></thead><tbody>'+p.rows.map(function(r){return '<tr><th scope="row">'+r[0]+'</th>'+r.slice(1).map(function(c,i){return '<td'+(i===r.length-2?' class="hl"':'')+'>'+c+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div></div></section>';
 var wn=t.when;
 h+='<section class="block" id="when"><div class="wrap two"><div><h2>'+wn.h+'</h2><p>'+wn.p+'</p><ul class="plain">'+li(wn.signs)+'</ul></div><div><div class="panel"><h3>'+wn.qH+'</h3><ul class="plain">'+li(wn.qs)+'</ul><p>'+wn.qNote+'</p></div></div></div></section>';
 var c=t.cond;
 h+='<section class="block" id="conditions"><div class="wrap"><div class="intro"><h2>'+c.h+'</h2><p>'+c.p+'</p></div><div class="cond"><div class="cond-tabs" role="tablist" aria-label="'+esc(c.h)+'">'+c.items.map(function(x){return '<button type="button" role="tab" id="tab-'+x.id+'" aria-controls="condPanel" data-c="'+x.id+'">'+x.n+'</button>'}).join('')+'</div><div class="cond-panel" id="condPanel" role="tabpanel" tabindex="0"></div></div></div></section>';
 var y=t.pay;
 h+='<section class="block tint" id="paying"><div class="wrap"><div class="intro"><h2>'+y.h+'</h2><p>'+y.p+'</p></div><div class="two"><div><h3>'+y.whoH+'</h3><ul class="plain">'+li(y.who)+'</ul><h3>'+y.costH+'</h3><ul class="plain">'+li(y.cost)+'</ul></div><div><h3>'+y.covH+'</h3><p>'+y.covP+'</p><h3>'+y.howH+'</h3><p>'+y.howP+'</p><div class="periods">'+y.periods.map(function(q,i){return '<div class="period '+(i<2?'p90':i==2?'p60':'more')+'"><b>'+q[0]+'</b>'+q[1]+'</div>'}).join('')+'</div><p class="small">'+y.periodNote+'</p></div></div><h3 style="margin-top:2.5rem">'+y.levelsH+'</h3><div class="levels">'+y.levels.map(function(l){return '<div><h3>'+l[0]+'</h3><p>'+l[1]+'</p></div>'}).join('')+'</div></div></section>';
 var ch=t.choose;
 h+='<section class="block" id="choosing"><div class="wrap"><div class="intro"><h2>'+ch.h+'</h2><p>'+ch.p+'</p></div><ul class="checklist" id="checklist">'+ch.list.map(function(q){return '<li><label><input type="checkbox"><span>'+q+'</span></label></li>'}).join('')+'</ul><p class="progress" id="progress" aria-live="polite"></p></div></section>';
 var cg=t.care;
 h+='<section class="block tint" id="caregiving"><div class="wrap two"><div><h2>'+cg.h+'</h2><p>'+cg.p+'</p><ul class="plain">'+li(cg.list)+'</ul></div><div><div class="panel"><h3>'+cg.panelH+'</h3><p>'+cg.panelP+'</p><p>'+cg.panelP2+'</p></div></div></div></section>';
 var lo=t.local;
 h+='<section class="block" id="local"><div class="wrap"><div class="intro"><h2>'+lo.h+'</h2><p>'+lo.p+'</p></div><div class="three">'+
  '<div><h3 class="col-h">'+lo.c1+'</h3><div class="stack">'+lo.hospices.map(function(x){return '<div class="local-card"><h4><a href="'+x[2]+'"'+EXT+'>'+x[0]+'</a></h4><p>'+x[1]+'</p>'+(x[3]?'<a class="ph" href="'+tel(x[3])+'">'+x[3]+'</a>':'')+'</div>'}).join('')+'</div></div>'+
  '<div><h3 class="col-h">'+lo.c2+'</h3><div class="stack">'+lo.lines.map(function(x){return '<div class="local-card"><h4>'+x[0]+'</h4><p>'+x[1]+'</p><a class="ph" href="'+tel(x[2])+'">'+x[2]+'</a></div>'}).join('')+'</div></div>'+
  '<div><h3 class="col-h">'+lo.c3+'</h3><div class="stack">'+lo.forms.map(function(x){return '<div class="local-card"><h4><a href="'+x[2]+'"'+EXT+'>'+x[0]+'</a></h4><p>'+x[1]+'</p></div>'}).join('')+'</div></div>'+
  '</div><p style="margin-top:1.6rem"><a class="btn btn-ghost" href="#/chapters/tri-valley">'+S.tv.h+'</a></p></div></section>';
 var pl=t.planning;
 h+='<section class="block tint" id="planning"><div class="wrap two"><div><h2>'+pl.h+'</h2><p>'+pl.p+'</p><ul class="plain">'+pl.list.map(function(x){return '<li><strong>'+x[0]+'</strong> '+x[1]+'</li>'}).join('')+'</ul><p>'+pl.formsP+'</p></div><div><div class="panel"><h3>'+pl.convH+'</h3><ul class="plain">'+li(pl.conv)+'</ul><p>'+pl.convNote+'</p></div></div></div></section>';
 var g=t.grief;
 h+='<section class="block" id="grief"><div class="wrap two"><div><h2>'+g.h+'</h2><p>'+g.p1+'</p><p>'+g.p2+'</p></div><div><div class="panel"><h3>'+g.kidsH+'</h3><p>'+g.kidsP+'</p><p>'+g.crisis+'</p></div></div></div></section>';
 var r=t.res;
 h+='<section class="block tint" id="resources"><div class="wrap"><div class="intro"><h2>'+r.h+'</h2><p>'+r.p+'</p></div><div class="dir-tools"><label class="search"><span class="sr">'+r.searchLabel+'</span>'+SRCH+'<input type="search" id="q" placeholder="'+esc(r.ph)+'" autocomplete="off"></label><div class="chips" role="group" aria-label="'+esc(r.filterLabel)+'" id="chips"></div></div>'+(lang!=="en"?'<label class="toggle"><input type="checkbox" id="mine"'+(onlyMine?' checked':'')+'> '+r.myLang+'</label>':'')+'<p class="count" id="count" aria-live="polite"></p><div class="dir" id="dir"></div></div></section>';
 h+=helpHTML();
 return h;
}
function helpHTML(){var hp=T[lang].help;return '<section class="block help" id="help"><div class="wrap"><h2>'+hp.h+'</h2><div class="lines">'+hp.lines.map(function(x){return '<div><span class="num">'+(x[1]?'<a href="'+x[1]+'">'+x[0]+'</a>':x[0])+'</span><p>'+x[2]+'</p></div>'}).join('')+'</div></div></section>'}

function renderCond(){
 var c=T[lang].cond,x=c.items.filter(function(i){return i.id===condSel})[0]||c.items[0];
 wireQuiz();
 [].forEach.call(document.querySelectorAll('.cond-tabs button'),function(b){var on=b.getAttribute('data-c')===x.id;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
 var pnl=document.getElementById('condPanel');pnl.setAttribute('aria-labelledby','tab-'+x.id);
 pnl.innerHTML='<h3 style="font-size:1.7rem">'+x.n+'</h3><p class="intro-p">'+x.i+'</p><div class="cond-cols"><div><h3>'+c.helpH+'</h3><ul class="plain">'+li(x.help)+'</ul></div><div><h3>'+c.signsH+'</h3><ul class="plain">'+li(x.signs)+'</ul></div></div><div class="note"><p><strong>'+c.tipH+':</strong> '+x.tip+'</p></div><p class="small" style="margin-top:1rem">'+c.more+' <a href="'+x.l[1]+'"'+EXT+'>'+x.l[0]+'</a></p>';
}
function renderDir(){
 var t=T[lang],r=t.res,term=(document.getElementById('q').value||'').trim().toLowerCase();
 var list=R.filter(function(x){
  if(topic!=="all"&&x.t.indexOf(topic)<0)return false;
  if(onlyMine&&lang!=="en"&&x.L.indexOf(lang)<0)return false;
  if(!term)return true;
  return (x.n+' '+x.d[lang]+' '+x.d.en+' '+x.t.map(function(k){return t.topics[k]}).join(' ')).toLowerCase().indexOf(term)>-1;
 });
 document.getElementById('count').textContent=list.length===1?r.count1:r.countN.replace('{n}',list.length);
 var dir=document.getElementById('dir');
 if(!list.length){dir.innerHTML='<div class="empty">'+r.empty+'</div>';return}
 dir.innerHTML=list.map(function(x){return '<article class="res"><h3><a href="'+x.u+'"'+EXT+'>'+esc(x.n)+'</a></h3><p>'+esc(x.d[lang])+'</p><div class="meta"><span class="who">'+t.who[x.w]+'</span>'+x.t.map(function(k){return '<span>'+t.topics[k]+'</span>'}).join('')+'</div><div class="lang-pills">'+x.L.map(function(l){return '<span lang="'+(l==='zh'?'zh-Hant':l)+'">'+LANGNAME[l]+'</span>'}).join('')+'</div></article>'}).join('');
}
function wireHome(){
 [].forEach.call(document.querySelectorAll('.flip'),function(b){b.addEventListener('click',function(){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.querySelector('.front').setAttribute('aria-hidden',on);b.querySelector('.back').setAttribute('aria-hidden',!on)})});
 [].forEach.call(document.querySelectorAll('.cond-tabs button'),function(b,i,all){
  b.addEventListener('click',function(){condSel=b.getAttribute('data-c');renderCond()});
  b.addEventListener('keydown',function(e){var k=e.key,n=null;if(k==='ArrowDown'||k==='ArrowRight')n=all[(i+1)%all.length];if(k==='ArrowUp'||k==='ArrowLeft')n=all[(i-1+all.length)%all.length];if(n){e.preventDefault();n.focus();n.click()}});
 });
 renderCond();
 var boxes=[].slice.call(document.querySelectorAll('#checklist input')),prog=document.getElementById('progress'),KEY='hospice-checklist';
 try{var saved=JSON.parse(localStorage.getItem(KEY)||'[]');boxes.forEach(function(b,i){b.checked=!!saved[i]})}catch(e){}
 function upd(){var n=boxes.filter(function(b){return b.checked}).length;prog.textContent=T[lang].choose.progress.replace('{n}',n).replace('{t}',boxes.length);try{localStorage.setItem(KEY,JSON.stringify(boxes.map(function(b){return b.checked})))}catch(e){}}
 boxes.forEach(function(b){b.addEventListener('change',upd)});upd();
 var t=T[lang],chips=document.getElementById('chips'),keys=["all"].concat(Object.keys(t.topics));
 chips.innerHTML=keys.map(function(k){return '<button type="button" class="chip" data-k="'+k+'" aria-pressed="'+(k===topic)+'">'+(k==="all"?t.res.all:t.topics[k])+'</button>'}).join('');
 chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;topic=b.getAttribute('data-k');[].forEach.call(chips.children,function(c){c.setAttribute('aria-pressed',c===b)});renderDir()});
 document.getElementById('q').addEventListener('input',renderDir);
 var mine=document.getElementById('mine');if(mine)mine.addEventListener('change',function(){onlyMine=mine.checked;renderDir()});
 renderDir();
}

var quizAns={};
function wireQuiz(){
 var Q=T[lang].extra.quiz,score=document.getElementById('qScore');
 function paint(){var n=0,t=0;[].forEach.call(document.querySelectorAll('.qcard'),function(c){var qi=+c.getAttribute('data-q'),q=Q.qs[qi],pick=quizAns[qi],fb=c.querySelector('.qfb');
   [].forEach.call(c.querySelectorAll('.opt'),function(b){var oi=+b.getAttribute('data-o');b.classList.remove('ok','no');b.setAttribute('aria-pressed',pick===oi);if(pick!==undefined){if(oi===q.a)b.classList.add('ok');else if(oi===pick)b.classList.add('no')}});
   if(pick!==undefined){t++;if(pick===q.a)n++;fb.innerHTML='<strong>'+(pick===q.a?Q.right:Q.wrong)+'</strong> '+q.e}else fb.textContent='';});
  score.textContent=t?Q.score.replace('{n}',n).replace('{t}',Q.qs.length):'';document.getElementById('qReset').hidden=!t}
 document.getElementById('quizList').addEventListener('click',function(e){var b=e.target.closest('.opt');if(!b)return;var qi=+b.closest('.qcard').getAttribute('data-q');quizAns[qi]=+b.getAttribute('data-o');paint()});
 document.getElementById('qReset').addEventListener('click',function(){quizAns={};paint();document.querySelector('.qcard .opt').focus()});
 paint();
}
/* ---------- ABOUT ---------- */
function crumbs(items){return '<p class="crumbs"><a href="#/">'+CONFIG.org+'</a>'+items.map(function(i){return ' / '+(i[1]?'<a href="'+i[1]+'">'+i[0]+'</a>':'<span aria-current="page">'+i[0]+'</span>')}).join('')+'</p>'}
function aboutHTML(){
 var A=T[lang].site.about,h='';
 h+='<section class="page-head"><div class="wrap">'+crumbs([[A.crumb]])+'<h1>'+A.h+'</h1><p class="lede">'+A.lede+'</p></div></section>';
 h+='<section class="block"><div class="wrap two"><div><h2>'+A.whyH+'</h2>'+A.why.map(function(p){return '<p>'+p+'</p>'}).join('')+'</div><div class="panel" style="align-self:start"><h3>'+A.doH+'</h3><ul class="plain">'+li(A.doList)+'</ul><h3>'+A.dontH+'</h3><ul class="plain">'+li(A.dontList)+'</ul></div></div></section>';
 h+='<section class="block tint" id="vision"><div class="wrap statements"><div><span class="lbl">'+A.missionH+'</span><p class="statement">'+A.mission+'</p></div><div><span class="lbl">'+A.visionH+'</span><p class="statement">'+A.vision+'</p></div></div></section>';
 var TM=T[lang].team;
 h+='<section class="block" id="team"><div class="wrap"><div class="intro"><h2>'+TM.h+'</h2><p>'+TM.lede+'</p></div>'+TM.members.map(function(m){var ph=PHOTO[m.id],ini=m.name.split(' ').map(function(w){return w[0]}).join('');return '<article class="member"><div class="door">'+(ph?'<img src="'+ph+'" alt="'+esc(TM.photoAlt.replace('{name}',m.name))+'">':'<span class="ini" role="img" aria-label="'+esc(TM.photoAlt.replace('{name}',m.name))+'">'+ini+'</span>')+'</div><div><p class="m-role">'+m.role+'</p><h3 class="m-name">'+m.name+'</h3><p class="m-bio">'+m.bio+'</p></div></article>'}).join('')+'</div></section>';
 var HI=T[lang].extra.hist;
 h+='<section class="block tint" id="history"><div class="wrap"><div class="intro"><h2>'+HI.h+'</h2></div><ol class="timeline">'+HI.items.map(function(x){return '<li><span class="yr">'+x[0]+'</span><div><h3>'+x[1]+'</h3><p>'+x[2]+'</p></div></li>'}).join('')+'</ol></div></section>';
 h+='<section class="block"><div class="wrap"><div class="intro"><h2>'+A.valuesH+'</h2></div><div class="vals">'+A.values.map(function(v){return '<div><h3>'+v[0]+'</h3><p>'+v[1]+'</p></div>'}).join('')+'</div></div></section>';
 h+='<section class="block tint"><div class="wrap"><div class="intro"><h2>'+A.faqH+'</h2></div><div class="faq" style="max-width:820px">'+A.faq.map(function(q){return '<details><summary><span>'+q[0]+'</span>'+CHEV.replace('class="chev"','class="chev" style="margin-left:auto"')+'</summary><p>'+q[1]+'</p></details>'}).join('')+'</div></div></section>';
 h+='<section class="block"><div class="wrap"><div class="cta-band"><div><h2>'+A.ctaH+'</h2><p>'+A.ctaP+'</p></div><div class="hero-ctas" style="margin:0"><a class="btn btn-solid" href="#/chapters/tri-valley">'+A.ctaBtns[0]+'</a><a class="btn btn-ghost" href="#/join">'+A.ctaBtns[1]+'</a></div></div></div></section>';
 return h;
}

/* ---------- CHAPTERS ---------- */
function chaptersHTML(){
 var C=T[lang].site.ch,h='';
 h+='<section class="page-head"><div class="wrap">'+crumbs([[C.crumb]])+'<h1>'+C.h+'</h1><p class="lede">'+C.lede+'</p></div></section>';
 var regions=[];CHAPTERS.forEach(function(c){if(regions.indexOf(c.region)<0)regions.push(c.region)});
 h+='<section class="block"><div class="wrap"><div class="ch-tools"><label class="search"><span class="sr">'+C.search+'</span>'+SRCH+'<input type="search" id="chq" placeholder="'+esc(C.search)+'" autocomplete="off"></label><select id="chr" aria-label="'+esc(C.regionAll)+'"><option value="">'+C.regionAll+'</option>'+regions.map(function(r){return '<option>'+r+'</option>'}).join('')+'</select><select id="chs" aria-label="'+esc(C.statusAll)+'"><option value="">'+C.statusAll+'</option><option value="active">'+C.status.active+'</option><option value="forming">'+C.status.forming+'</option></select></div><div class="ch-cards" id="chCards"></div></div></section>';
 h+='<section class="block tint" id="join"><div class="wrap two"><div><h2>'+C.startH+'</h2><p>'+C.startP+'</p><h3>'+C.doH+'</h3><div class="do-list">'+C.doList.map(function(d){return '<div><span class="dot" aria-hidden="true"></span><span><h3>'+d[0]+'</h3><p>'+d[1]+'</p></span></div>'}).join('')+'</div></div>'+formHTML()+'</div></section>';
 return h;
}
function formHTML(prefillState){
 var C=T[lang].site.ch,F=C.f,closed=!CONFIG.email;
 function fld(id,label,req,html,full){return '<div class="field'+(full?' full':'')+'"><label for="'+id+'">'+label+(req?' <small>('+F.req+')</small>':'')+'</label>'+html+'</div>'}
 return '<div class="form-card" id="formCard"><h3 style="font-size:1.5rem">'+C.formH+'</h3><p class="small">'+C.formP+'</p>'+(closed?'<p class="form-closed">'+F.closed+'</p>':'')+
 '<form id="chForm" novalidate><div class="fgrid">'+
 fld('f-name',F.name,1,'<input id="f-name" name="name" autocomplete="name" required>')+
 fld('f-email',F.email,1,'<input id="f-email" name="email" type="email" autocomplete="email" required>')+
 fld('f-city',F.city,1,'<input id="f-city" name="city" autocomplete="address-level2" required>')+
 fld('f-state',F.state,1,'<input id="f-state" name="state" autocomplete="address-level1" required value="'+(prefillState||'')+'">')+
 fld('f-type',F.type,0,'<select id="f-type" name="type">'+F.types.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select>')+
 fld('f-size',F.size,0,'<select id="f-size" name="size">'+F.sizes.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select>')+
 fld('f-langs',F.langs,0,'<input id="f-langs" name="langs">',1)+
 fld('f-why',F.why,1,'<textarea id="f-why" name="why" required></textarea>',1)+
 '</div><p style="margin:1.2rem 0 0"><button class="btn btn-solid" type="submit"'+(closed?' disabled':'')+'>'+F.submit+'</button></p><p class="form-msg" id="formMsg" role="status" aria-live="polite"></p></form></div>';
}
function wireForm(){
 var f=document.getElementById('chForm');if(!f)return;var F=T[lang].site.ch.f,msg=document.getElementById('formMsg');
 f.addEventListener('submit',function(e){
  e.preventDefault();if(!CONFIG.email)return;
  var bad=[];[].forEach.call(f.querySelectorAll('[required]'),function(i){var ok=i.value.trim()&&(i.type!=='email'||/\S+@\S+\.\S+/.test(i.value));i.setAttribute('aria-invalid',!ok);if(!ok)bad.push(i)});
  if(bad.length){msg.className='form-msg err';msg.textContent=F.err;bad[0].focus();return}
  var d=new FormData(f),lines=[F.name+': '+d.get('name'),F.email+': '+d.get('email'),F.city+': '+d.get('city')+', '+d.get('state'),F.type+': '+d.get('type'),F.size+': '+d.get('size'),F.langs+': '+d.get('langs'),'',F.why,d.get('why')];
  location.href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent('Chapter interest: '+d.get('city'))+'&body='+encodeURIComponent(lines.join('\n'));
  msg.className='form-msg';msg.innerHTML=esc(F.success)+' <button type="button" class="btn btn-ghost" id="again" style="margin-left:.5rem;padding:.35rem .8rem;font-size:.9rem">'+F.again+'</button>';
  document.getElementById('again').addEventListener('click',function(){f.reset();msg.textContent=''});
 });
}
function renderChapters(){
 var C=T[lang].site.ch,q=(document.getElementById('chq').value||'').toLowerCase(),r=document.getElementById('chr').value,st=document.getElementById('chs').value;
 var list=CHAPTERS.filter(function(c){var tv=T[lang].site.tv;var hay=(tv.h+' '+c.cities+' '+tv.cities+' '+c.region).toLowerCase();return (!q||hay.indexOf(q)>-1)&&(!r||c.region===r)&&(!st||c.status===st)});
 var el=document.getElementById('chCards');
 if(!list.length){el.innerHTML='<div class="empty">'+C.none+'</div>';return}
 el.innerHTML=list.map(function(c){var tv=T[lang].site.tv;return '<article class="ch-card"><span class="status '+c.status+'">'+C.status[c.status]+'</span><h3>'+tv.h+'</h3><p class="where">'+C.serves+': '+tv.cities+'</p><p class="small" style="margin:0">'+tv.lede+'</p><a class="btn btn-ghost" href="#/chapters/'+c.id+'">'+C.open+'</a></article>'}).join('');
}
function wireChapters(){['chq','chr','chs'].forEach(function(id){document.getElementById(id).addEventListener(id==='chq'?'input':'change',renderChapters)});renderChapters();wireForm()}

/* ---------- TRI-VALLEY ---------- */
function tvHTML(){
 var V=T[lang].site.tv,C=T[lang].site.ch,h='';
 h+='<section class="page-head"><div class="wrap">'+crumbs([[C.crumb,'#/chapters'],[V.crumb]])+'<span class="badge">'+V.badge+'</span><h1>'+V.h+'</h1><p class="lede" style="font-weight:700;color:var(--ink)">'+V.cities+'</p><p class="lede">'+V.lede+'</p><div class="hero-ctas"><a class="btn btn-solid" href="#tvjoin">'+V.join+'</a><a class="btn btn-ghost" href="#/chapters">'+V.back+'</a></div></div></section>';
 h+='<section class="block"><div class="wrap"><div class="intro"><h2>'+V.goalsH+'</h2></div><div class="pillars">'+V.goals.map(function(g){return '<div class="pillar"><h3>'+g[0]+'</h3><p>'+g[1]+'</p></div>'}).join('')+'</div></div></section>';
 h+='<section class="block tint"><div class="wrap"><div class="intro"><h2>'+V.cityH+'</h2></div><div class="cities">'+V.citiesL.map(function(c){return '<div class="city"><h3>'+c.n+'</h3><div class="stack">'+c.items.map(function(x){return '<div class="local-card"><h4>'+(x[3]?'<a href="'+x[3]+'"'+EXT+'>'+x[0]+'</a>':x[0])+'</h4><p>'+x[1]+'</p>'+(x[2]?'<a class="ph" href="'+tel(x[2])+'">'+x[2]+'</a>':'')+'</div>'}).join('')+'</div></div>'}).join('')+'</div></div></section>';
 if(CMS.items&&CMS.items.length){h+='<section class="block"><div class="wrap"><div class="intro"><h2>'+V.cmsH+'</h2><p>'+V.cmsP+'</p>'+(CMS.updated?'<p class="small">'+V.cmsUpdated.replace('{date}',fmtDate(CMS.updated))+'</p>':'')+'</div><div class="ch-cards">'+CMS.items.map(function(x){return '<div class="local-card"><h4>'+esc(x.name)+'</h4><p>'+esc([x.address,x.city].filter(Boolean).join(', '))+'</p>'+(x.phone?'<a class="ph" href="'+tel(x.phone)+'">'+esc(x.phone)+'</a>':'')+(x.url?'<a href="'+x.url+'"'+EXT+'>'+V.cmsView+'</a>':'')+'</div>'}).join('')+'</div></div></section>'}
 h+='<section class="block"><div class="wrap"><div class="intro"><h2>'+V.eventsH+'</h2></div>'+eventsHTML(V)+'<div class="talk"><span class="talk-ico" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/></svg></span><div><h3>'+T[lang].extra.talk.h+'</h3><p class="talk-by">'+T[lang].extra.talk.by+'</p><p>'+T[lang].extra.talk.p+'</p></div></div></div></section>';
 h+='<section class="block tint" id="tvjoin"><div class="wrap two"><div><h2>'+V.helpH+'</h2><div class="roles" style="margin-top:1.2rem">'+V.roles.map(function(r){return '<div><h3>'+r[0]+'</h3><p>'+r[1]+'</p></div>'}).join('')+'</div></div>'+formHTML('CA')+'</div></section>';
 return h;
}

function fmtDate(iso){try{return new Date(iso+'T12:00:00').toLocaleDateString(T[lang].htmlLang,{year:'numeric',month:'long',day:'numeric'})}catch(e){return iso}}
function evText(v){return v&&typeof v==='object'?(v[lang]||v.en||''):(v||'')}
function eventsHTML(V){
 var today=new Date().toISOString().slice(0,10);
 var up=EVENTS.filter(function(e){return e.date>=today}).sort(function(a,b){return a.date<b.date?-1:1});
 if(!up.length)return '<div class="empty-events"><p>'+V.eventsP+'</p><a class="btn btn-solid" href="#tvjoin">'+V.join+'</a></div>';
 return '<div class="ch-cards">'+up.map(function(e){return '<article class="ch-card"><span class="status active">'+fmtDate(e.date)+(e.time?', '+esc(e.time):'')+'</span><h3>'+esc(evText(e.title))+'</h3><p class="where">'+esc([e.place,e.city].filter(Boolean).join(', '))+'</p>'+(e.description?'<p class="small" style="margin:0">'+esc(evText(e.description))+'</p>':'')+(e.link?'<a class="btn btn-ghost" href="'+esc(e.link)+'"'+EXT+'>'+V.evDetails+'</a>':'')+'</article>'}).join('')+'</div>';
}
/* ---------- SHELL ---------- */
function footHTML(){
 var t=T[lang],F=t.site.footer;
 return '<div class="foot-grid"><div><div class="foot-brand">'+CONFIG.org+' '+CONFIG.orgSub+'</div><p>'+F.blurb+'</p></div><div><h4>'+F.learnH+'</h4><ul>'+F.learn.map(function(l){return '<li><a href="'+l[0]+'">'+l[1]+'</a></li>'}).join('')+'</ul></div><div><h4>'+F.netH+'</h4><ul>'+F.net.map(function(l){return '<li><a href="'+l[0]+'">'+l[1]+'</a></li>'}).join('')+'</ul></div><div><h4>'+F.contactH+'</h4><p>'+F.contactP+'</p><p><a class="btn btn-ghost" href="#/join" style="font-size:.92rem;padding:.45rem .95rem">'+t.site.cta+'</a></p></div></div><div class="fine">'+t.foot+'<p>© 2026 '+CONFIG.org+' '+CONFIG.orgSub+'. '+F.copy+'</p></div>';
}
function parse(){
 var hsh=location.hash||'';
 if(hsh.indexOf('#/')===0){var p=hsh.slice(2);
  if(p===''||p==='home')return{page:'home'};
  if(p==='about')return{page:'about'};
  if(p==='about/vision')return{page:'about',anchor:'vision'};
  if(p==='chapters')return{page:'chapters'};
  if(p==='join')return{page:'chapters',anchor:'join'};
  if(p==='chapters/tri-valley')return{page:'tv'};
  return{page:'home'};
 }
 return{page:'home',anchor:hsh.slice(1)||null};
}
function render(keepScroll){
 var r=parse(),t=T[lang],S=t.site;page=r.page;
 var main=document.getElementById('main');
 main.innerHTML=page==='about'?aboutHTML():page==='chapters'?chaptersHTML():page==='tv'?tvHTML():homeHTML();
 if(page==='home')wireHome();else if(page==='chapters')wireChapters();else if(page==='tv')wireForm();
 document.getElementById('foot').innerHTML=footHTML();
 document.getElementById('navList').innerHTML=S.nav.map(function(n){var cur=(n[0]==='#/'&&page==='home')||(n[0]==='#/about'&&page==='about')||(n[0]==='#/chapters'&&(page==='chapters'||page==='tv'));return '<li><a href="'+n[0]+'"'+(cur?' aria-current="page"':'')+'>'+n[1]+'</a></li>'}).join('');
 document.documentElement.lang=t.htmlLang;
 var pt={about:S.about.crumb,chapters:S.ch.crumb,tv:S.tv.crumb}[page];
 document.title=(pt?pt+' | ':'')+CONFIG.org+' '+CONFIG.orgSub;
 document.getElementById('brandName').textContent=CONFIG.org;
 document.getElementById('brandSub').textContent=CONFIG.orgSub;
 document.getElementById('headCta').textContent=S.cta;
 document.getElementById('skip').textContent=t.skip;
 document.getElementById('menuBtn').textContent=t.menu;
 var mt=document.getElementById('mtNote');mt.hidden=!t.mt;document.getElementById('mtText').textContent=t.mt;
 [].forEach.call(document.querySelectorAll('#langs button'),function(b){b.setAttribute('aria-pressed',b.getAttribute('data-l')===lang)});
 if(keepScroll)return;
 var el=r.anchor&&document.getElementById(r.anchor);
 if(el)el.scrollIntoView({behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange',function(){
 var hsh=location.hash;
 if(hsh.indexOf('#/')!==0&&hsh.length>1&&document.getElementById(hsh.slice(1)))return; // same-page anchor
 render();
});
var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
document.getElementById('langs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var l=b.getAttribute('data-l');if(l===lang)return;lang=l;try{localStorage.setItem('hospice-lang',l)}catch(err){}var y=window.scrollY;render(true);window.scrollTo(0,y)});
render();
})();
