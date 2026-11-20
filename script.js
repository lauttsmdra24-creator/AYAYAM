(()=>{
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);


function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const mk=(w,h)=>Array.from({length:h},()=>new Array(w).fill(null));
function px(g,x,y,c){if(y>=0&&y<g.length&&x>=0&&x<g[0].length)g[y][x]=c}
function rect(g,x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(g,x+i,y+j,c)}
function ell(g,cx,cy,rx,ry,c){const H=g.length,W=g[0].length;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)g[y][x]=c}}
function outline(g,c){const H=g.length,W=g[0].length;const o=g.map(r=>r.slice());
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x])continue;
    if((y>0&&g[y-1][x])||(y<H-1&&g[y+1][x])||(x>0&&g[y][x-1])||(x<W-1&&g[y][x+1]))o[y][x]=c}
  return o}
function paint(cv,g){cv.width=g[0].length;cv.height=g.length;const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);
  for(let y=0;y<g.length;y++)for(let x=0;x<g[0].length;x++)if(g[y][x]){c.fillStyle=g[y][x];c.fillRect(x,y,1,1)}}
function gridFrom(rows,pal){const h=rows.length,w=Math.max(...rows.map(r=>r.length));const g=mk(w,h);
  rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const ch=r[x];if(ch!=='.'&&pal[ch])g[y][x]=pal[ch]}});return g}
function pad(g,W,H){const o=mk(W,H);const ox=Math.floor((W-g[0].length)/2),oy=Math.floor((H-g.length)/2);
  g.forEach((r,y)=>r.forEach((c,x)=>{if(c)px(o,x+ox,y+oy,c)}));return o}
function urlOf(g){const cv=document.createElement('canvas');paint(cv,g);return cv.toDataURL()}

/* ================= food sprites ================= */
const P={o:'#3b2a2a',w:'#fff6e4',c:'#f1d7a8',r:'#e8393b',R:'#b3262a',b:'#7db4f2',B:'#4f84c9',p:'#ff93ad',P:'#e0607f',
  k:'#7a4a30',K:'#53301f',g:'#53b356',G:'#2f7d3a',l:'#c9e8a2',L:'#a6d072',F:'#e8f2a4',y:'#f7c948',n:'#e0a766',N:'#b97a3d',
  O:'#ff8a1f',D:'#d96a0a',s:'#d6f1fb',S:'#a9d9ec',t:'#8a5a34'};
const CUPCAKE=[
"................",
".......rr.......",
"......rrRr......",
"......wrRw......",
"....wwwwwwww....",
"...wwcwwwwcww...",
"..wwwwwwwwwwww..",
"...wcwwwwwwcw...",
"..bbbbbbbbbbbb..",
"...bBbbBbbBbb...",
"...bBbbBbbBbb...",
"....bBbbBbbB....",
"....bbBbbBbb....",
".....bbbbbb....."];
const SUNDAE=[
".......rr.......",
"......rrRr......",
"....wwwwwwww....",
"...wwpwwwwpww...",
"..kkkkkkkkkkkk..",
".kkKkkkkKkkkkKk.",
".kkkkkkkkkkkkkk.",
"..kKkkkkkkKkkk..",
".ssssssssssssss.",
"..sSssssssspss..",
"...ssssssssss...",
"....SssssssS....",
".....ssssss.....",
".......ss.......",
"......ssss......"];
const CAKE=[
"......g.g.......",
".....rrrrR......",
"....rrrrrrR.....",
".....rrrrR......",
".wwwwwwwwwwwwww.",
".wwwwwwwwwwwwww.",
".pppppppppppppp.",
".pPpppPpppPpppp.",
".wwwwwwwwwwwwww.",
".pppppppppppppp.",
".pPpppPpppPpppp.",
".PPPPPPPPPPPPPP."];
function mkRoll(){const g=mk(16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const dx=x+.5-8,dy=y+.5-8.3,d=Math.hypot(dx,dy);if(d>7.2)continue;
    const a=Math.atan2(dy,dx)/(Math.PI*2)+.5;const sp=(((d*.5+a)%1)+1)%1;let c=P.n;
    if(sp<.3)c=P.N;
    if(d<1.8)c=P.w;else if(d<3.2&&sp>=.3)c=P.w;
    if(d>1.8&&d<6.4&&Math.sin(x*1.1+y*.7)>.55)c=P.w;
    if(d>6.4)c=P.N;
    g[y][x]=c}
  return g}
function mkCarrot(){const g=mk(16,16);const x0=2.2,y0=13.8,x1=9.8,y1=6.4,dx=x1-x0,dy=y1-y0,L2=dx*dx+dy*dy;
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const X=x+.5,Y=y+.5;const t=((X-x0)*dx+(Y-y0)*dy)/L2;if(t<0||t>1.02)continue;
    const cx=x0+dx*t,cy=y0+dy*t;const dist=Math.hypot(X-cx,Y-cy);const r=.55+t*2.5;if(dist>r)continue;
    const side=((X-x0)*dy-(Y-y0)*dx)/Math.sqrt(L2);let c=P.O;if(side>0&&dist>r*.35)c=P.D;
    const st=(t*6)%1;if(st<.1&&dist<r*.85&&t>.15)c=P.D;g[y][x]=c}
  [[11,5,'g'],[12,4,'g'],[13,3,'G'],[10,4,'G'],[10,3,'g'],[9,2,'G'],[12,6,'g'],[13,6,'g'],[14,5,'G'],[11,3,'G']].forEach(([x,y,k])=>px(g,x,y,P[k]));
  return g}
function mkCuke(){const g=mk(16,16);const cx=8.5,cy=6.2,a=7,b=2.9,ang=-0.38,ca=Math.cos(ang),sa=Math.sin(ang);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const dx=x+.5-cx,dy=y+.5-cy;const u=dx*ca+dy*sa,v=-dx*sa+dy*ca;
    if((u/a)*(u/a)+(v/b)*(v/b)<=1){let c=P.G;if(v<-0.9)c=P.g;if(u<-5.6)c=P.l;if(u>5.8)c=P.L;if(c===P.g&&(x*7+y*3)%11===0)c=P.l;g[y][x]=c}}
  [[4.5,12.3],[10.5,12.6]].forEach(([sx,sy])=>{ell(g,sx,sy,2.9,2.9,P.g);ell(g,sx,sy,2.1,2.1,P.l);
    const fx=Math.floor(sx),fy=Math.floor(sy);px(g,fx,fy,P.L);px(g,fx-1,fy+1,P.L);px(g,fx+1,fy-1,P.L)});
  return g}
function mkAvo(){const g=mk(16,16);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const X=x+.5,Y=y+.5;
    const inTop=Math.hypot(X-8,Y-5.2)<=3.6,inBot=Math.hypot(X-8,Y-9.8)<=5.6;
    if(inTop||inBot){g[y][x]=P.G;if(Math.hypot(X-8,Y-5.4)<=2.2||Math.hypot(X-8,Y-9.8)<=4.2)g[y][x]=P.F;
      if(Math.hypot(X-8,Y-10)<=3.4&&Math.hypot(X-8,Y-10)>2.5)g[y][x]=P.l}}
  ell(g,8,10.6,2.4,2.5,P.t);px(g,7,9,P.n);px(g,7,10,P.n);
  return g}
const FOOD_BUILD={cupcake:()=>gridFrom(CUPCAKE,P),sundae:()=>gridFrom(SUNDAE,P),cake:()=>gridFrom(CAKE,P),roll:mkRoll,carrot:mkCarrot,cucumber:mkCuke,avocado:mkAvo};
function foodGrid(id){return outline(pad(FOOD_BUILD[id](),18,18),P.o)}
function foodCanvas(id){const cv=document.createElement('canvas');paint(cv,foodGrid(id));return cv}

/* ================= misc sprites ================= */
const HEART=[".rr...rr.","rwrr.rrrr","rrrrrrrrr","rrrrrrrrr",".rrrrrrd.","..rrrrr..","...rrr...","....r...."];
const heartFull=urlOf(outline(pad(gridFrom(HEART,{r:'#ff3b5c',w:'#ffb3c4',d:'#d12b4f'}),11,10),'#7a1230'));
const heartEmpty=urlOf(outline(pad(gridFrom(HEART,{r:'#6d5c70',w:'#857590',d:'#574759'}),11,10),'#2b1f3a'));
const STAR=urlOf(outline(pad(gridFrom(["..y..","..y..","yywyy","..y..","..y.."],{y:'#ffd93b',w:'#fff'}),7,7),'#a8731a'));
const EXC=urlOf(outline(pad(gridFrom([".rr.","rrrr","rrrr","rrrr",".rr.",".rr.","....",".rr.",".rr."],{r:'#ff3030'}),6,11),'#5b0f16'));
const XGRID=outline(pad(gridFrom(["r.....r",".r...r.","..r.r..","...r...","..r.r..",".r...r.","r.....r"],{r:'#e53935'}),11,11),'#5b0f16');
const SPK_ON=["...w........","..ww....w...","www..w...w..","www..w...w..","www..w...w..","..ww....w...","...w........"];
const SPK_OFF=["...w........","..ww..r...r.","www....r.r..","www.....r...","www....r.r..","..ww..r...r.","...w........"];
const spkOn=urlOf(outline(pad(gridFrom(SPK_ON,{w:'#fff'}),14,9),'#2b1f3a'));
const spkOff=urlOf(outline(pad(gridFrom(SPK_OFF,{w:'#fff',r:'#ff3030'}),14,9),'#2b1f3a'));
const zbubGrid=(()=>{const g=mk(12,12);ell(g,6,6,4.6,4.6,'#d8f1ff');px(g,4,4,'#fff');px(g,5,4,'#fff');px(g,4,5,'#fff');return outline(g,'#4a6f8a')})();

/* ================= chicken ================= */
const C={W:'#fdf6e6',W2:'#f2e6cd',S:'#ead9bd',SS:'#d3bd98',red:'#e8393b',beak:'#f6a623',beakD:'#d1801a',mouth:'#9c2a2a',eye:'#241a1a',blush:'#ff9db0',out:'#5b4036',leg:'#f6a623'};
const FLUSH={[C.W]:'#ffc4b8',[C.W2]:'#ffb3a5',[C.S]:'#f2a396',[C.SS]:'#dd8b80'};
function henGrid(o){
  const g=mk(40,42),by=o.bob||0,hy=o.head||0;
  const wy=o.flap?-2:0;
  ell(g,7.5,27+by+wy,4.3,6.6,C.W2);ell(g,32.5,27+by+wy,4.3,6.6,C.W2);
  [[5,25],[6,28],[7,31]].forEach(([x,y])=>px(g,x,y+by+wy,C.SS));
  [[34,25],[33,28],[32,31]].forEach(([x,y])=>px(g,x,y+by+wy,C.SS));
  ell(g,20,27+by,12.5,10.8,C.W);
  for(let y=0;y<42;y++)for(let x=0;x<40;x++)if(g[y][x]===C.W&&y>32+by)g[y][x]=C.S;
  [[16,30],[20,31],[24,30],[18,34],[22,34]].forEach(([x,y])=>px(g,x,y+by,C.SS));
  ell(g,20,20+by,8,6,C.W);
  ell(g,20,15+hy,9,8.6,C.W);
  [[15.5,6.5],[20,4.8],[24.5,6.5]].forEach(([x,y])=>ell(g,x,y+hy,2.6,2.6,C.red));
  rect(g,15,7+hy,10,2,C.red);
  (o.flowers||[]).forEach((c,i)=>{const sl=HEAD_SLOTS[i%HEAD_SLOTS.length];headFlower(g,sl[0],sl[1]+hy,c)});
  ell(g,20,22.5+hy,1.8,2.4,C.red);
  if(o.open){
    rect(g,18,16+hy,5,1,C.beak);rect(g,19,17+hy,3,2,C.mouth);rect(g,19,19+hy,3,1,C.beak);px(g,20,20+hy,C.beakD);
  }else{
    rect(g,18,16+hy,5,1,C.beak);rect(g,19,17+hy,3,1,C.beak);px(g,20,18+hy,C.beakD);
  }
  if(o.blush){rect(g,12,16+hy,3,2,C.blush);rect(g,25,16+hy,3,2,C.blush)}
  [15,24].forEach(ex=>{
    switch(o.eye){
      case 'blink':case 'line':rect(g,ex-1,13+hy,3,1,C.eye);break;
      case 'happy':[[-1,13],[0,12],[1,12],[2,13]].forEach(([dx,y])=>px(g,ex+dx,y+hy,C.eye));break;
      case 'sleep':[[-1,12],[0,13],[1,13],[2,12]].forEach(([dx,y])=>px(g,ex+dx,y+hy,C.eye));break;
      case 'angry':rect(g,ex,13+hy,2,1,C.eye);break;
      default:rect(g,ex,12+hy,2,2,C.eye);px(g,ex,12+hy,'#fff');
    }});
  if(o.eye==='angry'){
    [[13,10],[14,11],[15,11],[16,12],[17,12]].forEach(([x,y])=>px(g,x,y+hy,C.eye));
    [[27,10],[26,11],[25,11],[24,12],[23,12]].forEach(([x,y])=>px(g,x,y+hy,C.eye));}
  if(!o.tuck){rect(g,14,37,2,3,C.leg);rect(g,12,39,6,1,C.leg);rect(g,24,37,2,3,C.leg);rect(g,22,39,6,1,C.leg)}
  if(o.flush)for(let y=0;y<42;y++)for(let x=0;x<40;x++){const m=FLUSH[g[y][x]];if(m)g[y][x]=m}
  return outline(g,C.out)}

const FL_COLS=['#ff6fa5','#ffd23b','#ffffff','#b58cff','#ff5a4f','#6fb7ff'];
const HEAD_SLOTS=[[14,6],[26,6],[20,3],[11,10],[29,10],[20,8]];
function flowerGrid(col){const g=mk(11,19);
  rect(g,5,7,1,12,'#3fa04a');px(g,4,12,'#3fa04a');px(g,3,11,'#3fa04a');px(g,6,14,'#3fa04a');px(g,7,13,'#3fa04a');
  [[5.5,2.1],[7.8,3.8],[6.9,6.4],[4.1,6.4],[3.2,3.8]].forEach(([x,y])=>ell(g,x,y,1.7,1.7,col));
  ell(g,5.5,4.5,1.4,1.4,col==='#ffd23b'?'#ff9d2e':'#ffd23b');return g}
function vaseGrid(){const g=mk(20,22);
  ell(g,10,15,8.5,6.8,'#4fa3d8');rect(g,7,3,6,6,'#4fa3d8');rect(g,5,1,10,2,'#7ec8f0');rect(g,6,20,8,1,'#2f78a8');
  for(let y=0;y<22;y++)for(let x=0;x<20;x++)if(g[y][x]&&x>=14&&y>=9)g[y][x]='#3b86b8';
  rect(g,4,12,2,5,'#a8dcf7');
  for(let x=2;x<18;x++){if(g[14][x])g[14][x]=(x%3===0)?'#ff9db0':'#ffd23b';if(g[15][x])g[15][x]='#ffd23b'}
  return outline(pad(g,22,24),'#1f3f5a')}
function shelfGrid(){const g=mk(32,8);rect(g,0,0,32,1,'#e4b87c');rect(g,0,1,32,2,'#c98f55');rect(g,0,3,32,1,'#a56b3a');
  [[4,4],[5,5],[6,6],[25,4],[24,5],[23,6]].forEach(([x,y])=>px(g,x,y,'#8f5a30'));rect(g,4,4,3,1,'#8f5a30');rect(g,23,4,3,1,'#8f5a30');return outline(g,'#4a2c1a')}
function headFlower(g,cx,cy,col){[[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>px(g,cx+dx,cy+dy,col));px(g,cx,cy,col==='#ffd23b'?'#ff9d2e':'#ffd23b')}
function pageActive(el){const p=el.closest('.page');return !p||p.classList.contains('active')}
function Hen(cv){
  const h={cv,mood:'idle',tick:0,blink:0,hover:false,grid:null,_t:null,onIdle:null,flowers:[]};
  h.set=(m,ms)=>{h.mood=m;clearTimeout(h._t);if(ms)h._t=setTimeout(()=>{if(h.mood===m){h.mood='idle';if(h.onIdle)h.onIdle();h.draw()}},ms);h.draw()};
  h.draw=()=>{
    const t=h.tick++;const o={eye:'open',bob:0,head:0,flowers:h.flowers};
    switch(h.mood){
      case 'happy':o.eye='happy';o.blush=true;o.flap=(t&1)===1;o.head=(t&1)?-1:0;break;
      case 'angry':o.eye='angry';o.flush=true;o.open=(t&1)===0;o.head=(t&1)?-1:0;break;
      case 'eating':o.eye='happy';o.blush=true;o.open=(t&1)===0;o.head=(t&1)?1:0;break;
      case 'refuse':o.eye='line';break;
      case 'sleep':o.eye='sleep';o.blush=true;o.head=2;o.tuck=true;o.bob=1+((t>>3)&1);break;
      default:
        o.bob=(t>>2)&1;o.head=o.bob;o.open=h.hover;
        if(t%26===0)h.blink=2;
        if(h.blink>0){h.blink--;o.eye='blink'}
    }
    h.grid=henGrid(o);paint(cv,h.grid);
  };
  h.page=cv.closest('.page');
  setInterval(()=>{if(!h.page||h.page.classList.contains('active'))h.draw()},130);
  h.draw();
  return h}

/* ================= textures ================= */
let PS=4;
function plankTile(){const r=rng(11),cv=document.createElement('canvas');cv.width=96;cv.height=96;const x=cv.getContext('2d');
  const base=['#c9a78c','#bf9c80','#d3b398','#c4a085'];
  for(let i=0;i<4;i++){x.fillStyle=base[i];x.fillRect(i*24,0,24,96);
    for(let k=0;k<22;k++){const gx=i*24+2+Math.floor(r()*20),gy=Math.floor(r()*96),len=6+Math.floor(r()*22);
      x.fillStyle=r()<.5?'rgba(90,60,50,.22)':'rgba(255,255,255,.14)';x.fillRect(gx,gy,1,len)}
    if(r()<.7){const kx=i*24+6+Math.floor(r()*12),ky=10+Math.floor(r()*76);
      x.fillStyle='rgba(90,60,50,.45)';x.fillRect(kx,ky,3,4);x.fillStyle='rgba(60,40,35,.5)';x.fillRect(kx+1,ky+1,1,2)}
    x.fillStyle='#5b4038';x.fillRect(i*24,0,1,96);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(i*24+1,0,1,96)}
  return cv.toDataURL()}
function floorTex(w,h){const r=rng(23),cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
  const tops=[];let t=7;for(let i=0;i<w;i++){t+=Math.round((r()-.5)*2);t=clamp(t,2,12);tops.push(t)}
  for(let i=0;i<w;i++){x.fillStyle='#f0bf2c';x.fillRect(i,tops[i],1,h-tops[i])}
  const cols=['#fbe06e','#e3a61c','#c98810','#ffe9a0','#f6cc3c'];const n=Math.floor(w*h/9);
  for(let i=0;i<n;i++){const sx=Math.floor(r()*w),sy=Math.floor(r()*h),len=4+Math.floor(r()*9),dir=r()<.5?-1:1;x.fillStyle=cols[Math.floor(r()*cols.length)];
    for(let k=0;k<len;k++){const yy=sy+dir*Math.round(Math.sin(k/len*Math.PI)*2),xx=sx+k;if(xx<w&&yy>=tops[xx]&&yy<h)x.fillRect(xx,yy,1,1)}}
  x.fillStyle='rgba(150,90,10,.25)';x.fillRect(0,h-4,w,4);
  return cv.toDataURL()}
function drawGrass(){
  const W=innerWidth,H=innerHeight;
  const w=Math.ceil(W/PS)+1,h=Math.max(14,Math.round(H*.17/PS));
  const layers=[$('#grassB'),$('#grass')].map(cv=>{
    cv.width=w;cv.height=h;cv.style.width=w*PS+'px';cv.style.height=h*PS+'px';
    const c=cv.getContext('2d');c.clearRect(0,0,w,h);return c});
  const r=rng(5);
  const greens=['#2f8f2f','#3fae38','#58c944','#7fe05a','#a6f07a'];
  const blades=Math.floor(w*1.9);
  for(let i=0;i<blades;i++){
    const x=layers[i&1]; // selang-seling: belakang / depan
    const bx=Math.floor(r()*w),bh=Math.floor(6+r()*(h-7)),lean=(r()-.5)*.9,ci=Math.floor(r()*3);
    for(let k=0;k<bh;k++){
      const xx=bx+Math.round(lean*k*.35),yy=h-1-k;
      const tip=k>bh*.7?1:0;
      x.fillStyle=greens[Math.min(4,ci+tip+(k>bh*.85?1:0))];
      x.fillRect(xx,yy,k<bh*.4?2:1,1)}}
  layers.forEach(x=>{
    x.fillStyle='#1f7a24';x.fillRect(0,h-3,w,3);
    x.fillStyle='#2f8f2f';x.fillRect(0,h-5,w,2)});
}
function hayGrid(){const r=rng(7);const g=mk(64,40);
  
  for(let y=6;y<=26;y++){const t=(y-6)/20,x0=Math.round(8-6*t),x1=Math.round(56+5*t);
    for(let x=x0;x<=x1;x++){g[y][x]=((y-6)%5===4)?'#b9814a':'#d9a468'}}
  for(let i=0;i<120;i++){const y=6+Math.floor(r()*21),x=3+Math.floor(r()*58),len=2+Math.floor(r()*5);
    for(let k=0;k<len;k++)if(g[y]&&g[y][x+k]&&g[y][x+k]!=='#b9814a')g[y][x+k]=r()<.5?'#e4b87c':'#c8935a'}
  for(let x=8;x<=56;x++)if(g[6][x])g[6][x]='#f0cb94';
 
  for(let y=27;y<=31;y++)for(let x=2;x<=61;x++)g[y][x]=y===27?'#8f5a30':y===31?'#6f4424':'#a56b3a';
  for(let i=0;i<50;i++){const y=28+Math.floor(r()*3),x=3+Math.floor(r()*56);if(g[y][x]) g[y][x]='#94602f'}
 
  for(let y=32;y<=39;y++){for(let x=4;x<=9;x++)g[y][x]=x<=5?'#a56b3a':'#8a5a30';for(let x=54;x<=59;x++)g[y][x]=x<=55?'#a56b3a':'#8a5a30'}
  return outline(g,'#4a2c1a')}
function build(){
  const W=innerWidth,H=innerHeight;PS=Math.max(3,Math.round(Math.min(W,H)/150));
  const s=document.documentElement.style;s.setProperty('--ps',PS+'px');
  s.setProperty('--plank',`url(${plankTile()})`);s.setProperty('--plank-size',96*PS+'px');
  const portrait=H>W;const fh=Math.max(20,Math.round(H*(portrait?.44:.34)/PS)),fw=Math.ceil(W/PS)+2;
  s.setProperty('--floor',`url(${floorTex(fw,fh)})`);s.setProperty('--floor-w',fw*PS+'px');s.setProperty('--floor-h',fh*PS+'px');
  drawGrass()}

/* ================= audio ================= */
const A={ctx:null,master:null,mus:null,fx:null,on:true,track:null,step:0,next:0,timer:null,nb:null};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function ensure(){
  if(!A.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    try{A.ctx=new AC()}catch(e){return false}
    A.master=A.ctx.createGain();A.master.gain.value=A.on?1:0;A.master.connect(A.ctx.destination);
    A.mus=A.ctx.createGain();A.mus.gain.value=.55;A.mus.connect(A.master);
    A.fx=A.ctx.createGain();A.fx.gain.value=.9;A.fx.connect(A.master);
    const n=(A.ctx.sampleRate*.25)|0;A.nb=A.ctx.createBuffer(1,n,A.ctx.sampleRate);const d=A.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1}
  if(A.ctx.state==='suspended')A.ctx.resume();
  return true}
function tone(f,t,dur,type,vol,dest,slide){
  const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.03)}
function hat(t,dur,vol,dest){const s=A.ctx.createBufferSource();s.buffer=A.nb;const f=A.ctx.createBiquadFilter();f.type='highpass';f.frequency.value=6500;
  const g=A.ctx.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(dest);s.start(t);s.stop(t+dur+.02)}
const MAIN_L=[72,76,79,76,72,76,79,0, 71,74,79,74,71,74,79,0, 69,72,76,72,69,72,76,0, 65,69,72,69,67,71,74,0,
              79,0,76,72,76,0,72,0, 79,0,74,71,74,0,71,0, 76,0,72,69,72,76,81,0, 77,76,74,71,72,0,0,0];
const BR=[[48,55],[43,50],[45,52],[41,43],[48,55],[43,50],[45,52],[43,48]];
const MAIN_B=MAIN_L.map((_,s)=>{const b=BR[s>>3],k=s&7;return k===0?b[0]:k===4?b[1]:0});
const SLEEP_L=[76,0,79,0,81,0,79,0, 76,0,72,0,74,0,0,0, 72,0,76,0,79,0,76,0, 74,0,71,0,72,0,0,0];
const SLEEP_B=SLEEP_L.map((_,s)=>s===0?48:s===8?43:s===16?45:s===24?41:0);
const TR={
  main:{dt:60/132/2,len:64,lead:MAIN_L,bass:MAIN_B,hat:MAIN_L.map((_,i)=>i&1),ld:.2,lt:'square',lv:.05,bd:.42,bt:'triangle',bv:.14,hv:.035},
  sleep:{dt:.55,len:32,lead:SLEEP_L,bass:SLEEP_B,ld:.95,lt:'sine',lv:.1,bd:2.2,bt:'sine',bv:.11}
};
function sched(){
  if(!A.track||!A.ctx)return;const T=TR[A.track];
  while(A.next<A.ctx.currentTime+.25){
    const s=A.step,t=A.next;
    if(T.lead[s])tone(mtof(T.lead[s]),t,T.ld,T.lt,T.lv,A.mus);
    if(T.bass[s])tone(mtof(T.bass[s]),t,T.bd,T.bt,T.bv,A.mus);
    if(T.hat&&T.hat[s])hat(t,.04,T.hv,A.mus);
    A.next+=T.dt;A.step=(A.step+1)%T.len}}
function play(name){if(!ensure())return;if(A.track===name)return;A.track=name;A.step=0;A.next=A.ctx.currentTime+.08;clearInterval(A.timer);A.timer=setInterval(sched,60)}
function now(d){return A.ctx.currentTime+(d||0)}
const SFX={
  click(){if(!ensure())return;tone(700,now(),.06,'square',.1,A.fx,1000)},
  pick(){if(!ensure())return;tone(600,now(),.07,'square',.09,A.fx,900)},
  chomp(){if(!ensure())return;[0,.14,.28].forEach(d=>tone(230,now(d),.1,'square',.13,A.fx,110))},
  happy(){if(!ensure())return;[784,988,1175].forEach((f,i)=>tone(f,now(i*.09),.12,'triangle',.16,A.fx))},
  purr(){if(!ensure())return;[0,.07,.14].forEach(d=>tone(340,now(d),.07,'triangle',.1,A.fx,420))},
  poke(){if(!ensure())return;tone(480,now(),.09,'square',.1,A.fx,300)},
  angry(){if(!ensure())return;[0,.3].forEach(d=>tone(280,now(d),.28,'sawtooth',.12,A.fx,100))},
  reject(){if(!ensure())return;[0,.16].forEach(d=>tone(210,now(d),.12,'square',.11,A.fx,150))},
  fanfare(){if(!ensure())return;[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,now(i*.11),.2,'triangle',.17,A.fx))}
};
function setMute(on){A.on=on;if(A.master)A.master.gain.value=on?1:0;$('#muteIcon').src=on?spkOn:spkOff}
$('#mute').addEventListener('pointerdown',e=>{e.stopPropagation();ensure();setMute(!A.on);if(A.on){SFX.click();if(!A.track)play(cur===3?'sleep':'main')}});
document.addEventListener('visibilitychange',()=>{if(!A.ctx)return;if(document.hidden)A.ctx.suspend();else if(A.on)A.ctx.resume()});
document.addEventListener('pointerdown',()=>{ensure();if(!A.track)play(cur===3?'sleep':'main')},{once:false,capture:true});
document.addEventListener('contextmenu',e=>e.preventDefault());

/* ================= pages ================= */
let cur=1;
function go(n){$('#p'+cur).classList.remove('active');cur=n;$('#p'+n).classList.add('active')}

/* ---- cover ---- */
$('#playBtn').addEventListener('click',()=>{SFX.click();play('main');resetGame();go(2)});

/* ---- game ---- */
const hen=Hen($('#henCv'));
const henCv=$('#henCv'),henIn=$('#henIn'),bubble=$('#bubble'),reqCv=$('#reqCv'),fx=$('#fx'),meterEl=$('#meter');
const SWEETS=['cupcake','sundae','roll','cake'];
const FOODS=[
  {id:'cupcake',x:15,y:64,w:16},{id:'sundae',x:38,y:64,w:16},{id:'roll',x:62,y:64,w:16},{id:'cake',x:85,y:64,w:16},
  {id:'cucumber',x:22,y:38,w:17},{id:'avocado',x:50,y:38,w:15},{id:'carrot',x:78,y:38,w:17}];
const NEED=5;
const G={fed:0,req:null,last:null,taps:[],petAccum:0,petting:false,lastPet:0,lastHeart:0,lastPurr:0,down:null,prev:null,done:false,dragging:false};
paint($('#hayCv'),hayGrid());

function restart(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c);el.addEventListener('animationend',()=>el.classList.remove(c),{once:true})}
function buildMeter(){meterEl.innerHTML='';for(let i=0;i<NEED;i++){const im=document.createElement('img');im.src=heartEmpty;im.alt='';meterEl.appendChild(im)}}
function updateMeter(pop){[...meterEl.children].forEach((im,i)=>{im.src=i<G.fed?heartFull:heartEmpty;if(pop&&i===G.fed-1)restart(im,'pop')})}

function bubbleShow(kind,id){
  if(kind==='food')paint(reqCv,foodGrid(id));
  else if(kind==='x')paint(reqCv,XGRID);
  else if(kind==='exc'){const g=outline(pad(gridFrom([".rr.","rrrr","rrrr","rrrr",".rr.",".rr.","....",".rr.",".rr."],{r:'#ff3030'}),11,11),'#5b0f16');paint(reqCv,g)}
  bubble.classList.add('on')}
function bubbleHide(){bubble.classList.remove('on')}
function showReq(){if(G.done||!G.req||hen.mood!=='idle'||G.petting)return;bubbleShow('food',G.req)}
hen.onIdle=()=>{G.petting=false;showReq()};
function nextRequest(){if(G.done)return;const pool=SWEETS.filter(s=>s!==G.last);G.req=pool[Math.floor(Math.random()*pool.length)];G.last=G.req;showReq()}

function spawn(kind,xp,yp,sizeMul,extra){
  const im=document.createElement('img');im.src=kind==='heart'?heartFull:kind==='star'?STAR:EXC;im.className=kind==='exc'?'exc':kind;
  const w=Math.max(12,Math.round(henCv.clientWidth*(sizeMul||.09)));im.style.width=w+'px';
  im.style.left=xp+'%';im.style.top=yp+'%';if(extra)Object.entries(extra).forEach(([k,v])=>im.style.setProperty(k,v));
  fx.appendChild(im);im.addEventListener('animationend',()=>im.remove())}

function resetGame(){
  G.gen=(G.gen||0)+1;G.fed=0;G.req=null;G.last=null;G.taps=[];G.petAccum=0;G.petting=false;G.done=false;G.down=null;
  fx.innerHTML='';hen.flowers=[];hen3.flowers=[];makeFlowers();buildMeter();bubbleHide();henIn.className='hen-in';hen.set('idle');
  document.querySelectorAll('.food').forEach(el=>{el.style.transition='none';el.style.transform='';el.style.opacity='1';el.classList.remove('drag')});
  setTimeout(nextRequest,700)}

/* drag & feed */
function henRect(){return henCv.getBoundingClientRect()}
function overHen(el){const r=el.getBoundingClientRect(),h=henRect();const cx=r.left+r.width/2,cy=r.top+r.height/2,m=h.width*.06;
  return cx>=h.left-m&&cx<=h.right+m&&cy>=h.top-m&&cy<=h.bottom+m}
function bindDrag(el,id){
  let d=null;
  el.addEventListener('pointerdown',e=>{if(G.done||el.dataset.busy||d)return;e.preventDefault();el.setPointerCapture(e.pointerId);
    d={sx:e.clientX,sy:e.clientY,dx:0,dy:0,pid:e.pointerId};G.dragging=true;el.classList.add('drag');el.style.transition='none';SFX.pick()});
  el.addEventListener('pointermove',e=>{if(!d||e.pointerId!==d.pid)return;d.dx=e.clientX-d.sx;d.dy=e.clientY-d.sy;
    el.style.transform=`translate(${d.dx}px,${d.dy}px) scale(1.12)`;
    const over=overHen(el);if(!el.classList.contains('flower')&&hen.hover!==over){hen.hover=over;hen.draw()}});
  const end=e=>{if(!d||e.pointerId!==d.pid)return;const cancelled=e.type==='pointercancel';const cur=d;d=null;G.dragging=false;
    const over=!cancelled&&overHen(el);hen.hover=false;
    if(over){if(el.classList.contains('flower'))giveFlower(el,cur);else feed(el,id,cur)}else giveBack(el)};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end)}
function giveBack(el){el.style.transition='transform .3s cubic-bezier(.3,1.5,.5,1)';el.style.transform='';setTimeout(()=>el.classList.remove('drag'),300)}
const flowersEl=$('#flowers');
const FL_SLOTS=[[40,-26,19],[44,-13,16],[56,13,17],[60,26,20],[50,0,14],[53,6,9]];
function addFlower(i,pop){const sl=FL_SLOTS[i],col=FL_COLS[i];
  const el=document.createElement('div');el.className='flower';el.dataset.col=col;el.dataset.slot=i;
  el.style.left=(sl[0]-18)+'%';el.style.top=sl[2]+'%';el.style.setProperty('--rot',sl[1]+'deg');
  const cv=document.createElement('canvas');paint(cv,outline(pad(flowerGrid(col),13,21),'#4a2a2a'));el.appendChild(cv);
  flowersEl.appendChild(el);bindDrag(el,'flower');if(pop)restart(el,'respawn')}
function makeFlowers(){flowersEl.innerHTML='';FL_SLOTS.forEach((_,i)=>addFlower(i))}
paint($('#vaseCv'),vaseGrid());paint($('#shelfCv'),shelfGrid());
function giveFlower(el,d){
  if(G.done||hen.mood==='angry'||hen.mood==='eating'||hen.mood==='refuse')return giveBack(el);
  el.dataset.busy='1';
  const r=el.getBoundingClientRect(),h=henRect();
  const tx=h.left+h.width*(20/40),ty=h.top+h.height*(4/42);
  const nx=d.dx+(tx-(r.left+r.width/2)),ny=d.dy+(ty-(r.top+r.height/2));
  el.style.transition='transform .28s ease-in,opacity .28s steps(3)';el.style.transform=`translate(${nx}px,${ny}px) scale(.45)`;el.style.opacity='0';
  const slot=+el.dataset.slot,gen=G.gen;setTimeout(()=>el.remove(),320);setTimeout(()=>{if(!G.done&&G.gen===gen)addFlower(slot,true)},1800);
  if(hen.flowers.length<6)hen.flowers.push(el.dataset.col);
  G.petting=false;bubbleHide();hen.set('happy',1700);restart(henIn,'sq');SFX.happy();
  for(let i=0;i<4;i++)setTimeout(()=>spawn('heart',rnd(30,60),rnd(0,14),rnd(.07,.11)),i*140)}
function feed(el,id,d){
  if(G.done)return giveBack(el);
  if(hen.mood==='angry'||hen.mood==='eating'||id!==G.req){
    // refuse
    if(hen.mood!=='angry'){hen.set('refuse',900);bubbleShow('x')}
    restart(henIn,'sh');SFX.reject();giveBack(el);return}
  // eat
  el.dataset.busy='1';G.req=null;bubbleHide();G.petting=false;
  const r=el.getBoundingClientRect(),h=henRect();
  const mx=h.left+h.width*(20/40),my=h.top+h.height*(18/42);
  const nx=d.dx+(mx-(r.left+r.width/2)),ny=d.dy+(my-(r.top+r.height/2));
  el.style.transition='transform .26s ease-in,opacity .26s steps(3)';el.style.transform=`translate(${nx}px,${ny}px) scale(.25)`;el.style.opacity='0';
  hen.set('eating',1100);henIn.classList.remove('ang');restart(henIn,'hop');
  SFX.chomp();setTimeout(SFX.happy,520);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;spawn('star',45,40,.07,{'--dx':Math.round(Math.cos(a)*90)+'%','--dy':Math.round(Math.sin(a)*90)+'%'})}
  spawn('heart',46,10,.1);
  G.fed++;setTimeout(()=>updateMeter(true),300);
  setTimeout(()=>{el.style.transition='none';el.style.transform='';el.classList.remove('drag');delete el.dataset.busy;restart(el,'respawn');el.style.opacity='1'},1500);
  if(G.fed>=NEED){G.done=true;setTimeout(finishGame,1250)}else setTimeout(nextRequest,1250)}
function finishGame(){SFX.fanfare();hen.set('happy');for(let i=0;i<8;i++)setTimeout(()=>spawn('heart',rnd(20,70),rnd(5,30),.1),i*90);
  setTimeout(()=>{play('sleep');goSleep()},1500)}
const foodsEl=$('#foods');
FOODS.forEach(f=>{const el=document.createElement('div');el.className='food';el.dataset.id=f.id;
  el.style.left=(f.x-f.w/2)+'%';el.style.bottom=f.y+'%';el.style.width=f.w+'%';el.appendChild(foodCanvas(f.id));foodsEl.appendChild(el);bindDrag(el,f.id)});
buildMeter();

/* petting + tapping */
function localHen(e){const r=henRect();const gx=(e.clientX-r.left)/r.width*40,gy=(e.clientY-r.top)/r.height*42;
  const hit=!!(hen.grid&&hen.grid[Math.floor(gy)]&&hen.grid[Math.floor(gy)][Math.floor(gx)]);
  const inHead=((gx-20)/10.5)**2+((gy-13.5)/11)**2<=1;return{hit,inHead}}
henCv.addEventListener('pointerdown',e=>{if(G.done||G.dragging)return;const p=localHen(e);if(!p.hit)return;G.down={t:performance.now(),moved:0};G.prev=[e.clientX,e.clientY]});
henCv.addEventListener('pointermove',e=>{
  if(G.done||G.dragging)return;
  const d=G.prev?Math.hypot(e.clientX-G.prev[0],e.clientY-G.prev[1]):0;G.prev=[e.clientX,e.clientY];
  if(G.down)G.down.moved+=d;
  const p=localHen(e);if(!p.inHead||!p.hit)return;
  G.petAccum=Math.min(G.petAccum+d,henCv.clientWidth*2);
  if(G.petAccum>henCv.clientWidth*.32&&(hen.mood==='idle'||hen.mood==='happy')){
    const t=performance.now();G.lastPet=t;
    if(!G.petting){G.petting=true;bubbleHide();hen.set('happy');restart(henIn,'sq')}
    if(t-G.lastHeart>240){G.lastHeart=t;spawn('heart',rnd(32,62),rnd(2,16),rnd(.07,.12))}
    if(t-G.lastPurr>900){G.lastPurr=t;SFX.purr()}}});
henCv.addEventListener('pointerleave',()=>{G.prev=null});
window.addEventListener('pointerup',()=>{
  if(!G.down)return;const dt=performance.now()-G.down.t,moved=G.down.moved;G.down=null;
  if(G.done||G.dragging)return;if(moved<14&&dt<420)registerTap()});
window.addEventListener('pointercancel',()=>{G.down=null});
function registerTap(){
  if(hen.mood==='angry'||hen.mood==='eating')return;
  const t=performance.now();G.taps=G.taps.filter(x=>t-x<1800);G.taps.push(t);
  restart(henIn,'sq');SFX.poke();
  if(G.taps.length>=4){G.taps=[];makeAngry()}}
function makeAngry(){
  G.petting=false;G.petAccum=0;hen.set('angry',2600);bubbleShow('exc');henIn.classList.add('ang');SFX.angry();
  [[30,-4],[48,-8],[64,0]].forEach(([x,y],i)=>setTimeout(()=>spawn('exc',x,y,.09),i*160));
  setTimeout(()=>henIn.classList.remove('ang'),2600)}
setInterval(()=>{
  if(G.petting&&hen.mood==='happy'&&performance.now()-G.lastPet>650){G.petting=false;G.petAccum=0;hen.set('idle');showReq()}
  if(!G.petting&&G.petAccum>0)G.petAccum=Math.max(0,G.petAccum-henCv.clientWidth*.02)},200);

/* ---- sleep page ---- */
const hen3=Hen($('#henCv3'));
const starsEl=$('#stars');
(function(){const r=rng(99);for(let i=0;i<30;i++){const s=document.createElement('div');s.className='star';const sz=1+Math.floor(r()*2);
  s.style.cssText=`left:${(r()*96).toFixed(1)}%;top:${(r()*52).toFixed(1)}%;width:calc(var(--ps)*${sz});height:calc(var(--ps)*${sz});animation-delay:${(r()*1.6).toFixed(2)}s`;starsEl.appendChild(s)}})();
(function(){const g=mk(22,22);ell(g,10.5,11,8.6,8.6,'#fff3b0');ell(g,15.5,8.5,7.4,7.4,null);
  for(let y=0;y<22;y++)for(let x=0;x<22;x++){if(g[y][x]&&(x-15.5)**2+(y-8.5)**2<=7.4*7.4)g[y][x]=null}
  px(g,6,13,'#f0dc8a');px(g,7,13,'#f0dc8a');px(g,5,9,'#f0dc8a');px(g,8,16,'#f0dc8a');paint($('#moon'),outline(g,'#b89a3c'))})();
paint($('#zbub'),zbubGrid);
function goSleep(){
  hen3.flowers=hen.flowers.slice();hen3.set('happy');go(3);
  setTimeout(()=>{if(cur===3)hen3.set('sleep')},1100)}
$('#againBtn').addEventListener('click',()=>{SFX.click();play('main');resetGame();go(2)});

/* ================= init ================= */
setMute(true);
build();
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(build,150)});
addEventListener('orientationchange',()=>{clearTimeout(rz);rz=setTimeout(build,300)});
})();