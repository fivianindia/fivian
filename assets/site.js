(function(){
var KEY='fivian_cart_v2',WA='919088055818',DISCORD_WEBHOOK=''; /* optional: paste a Discord webhook URL here to also log orders */
try{localStorage.removeItem('fivian_cart')}catch(e){}
var cart={};try{cart=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var rs=function(n){return'\u20B9'+n};
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
function totals(){var q=0,t=0;for(var k in cart){q+=cart[k].q;t+=cart[k].q*cart[k].p}return{q:q,t:t}}
function change(key,meta,d){var c=cart[key]||(cart[key]={n:meta.n,l:meta.l,p:meta.p,q:0});c.q+=d;if(c.q<=0)delete cart[key];save();refresh()}
function cardState(card){var v=JSON.parse(card.dataset.v),i=+(card.dataset.sel||0),x=v[i];return{v:v,x:x,i:i,key:card.dataset.id+'|'+x.k,meta:{n:card.dataset.name,l:x.l,p:x.p}}}
function paint(card){var s=cardState(card),x=s.x,q=cart[s.key]?cart[s.key].q:0;
$('.ph img',card).src=x.i;var tg=$('.tag',card);if(x.w&&x.w>x.p){tg.hidden=false;tg.textContent=Math.round((1-x.p/x.w)*100)+'% off'}else tg.hidden=true;
$('.pr',card).innerHTML=(x.w&&x.w>x.p?'<del>'+rs(x.w)+'</del>':'')+rs(x.p)+(x.l&&s.v.length==1?'<small>'+x.l+'</small>':'');
$('.act',card).innerHTML=q?'<div class="q"><button data-a="m" aria-label="Remove one">\u2212</button><span>'+q+'</span><button data-a="p" aria-label="Add one">+</button></div>':'<button class="add" data-a="p">+ Add</button>'}
function refresh(){var t=totals();$('#cnt').textContent=t.q;$$('.card').forEach(paint);var s=$('#stk');s.hidden=!t.q;s.textContent='\uD83D\uDED2 View cart \u2022 '+t.q+' item'+(t.q>1?'s':'')+' \u2022 '+rs(t.t);if(!$('#cartM').hidden)renderCart()}
function renderCart(){var box=$('#items'),t=totals();box.innerHTML='';
if(!t.q){box.innerHTML='<p class="emp">Your cart is empty. Add something sweet!</p>'}
Object.keys(cart).forEach(function(k){var c=cart[k],r=document.createElement('div');r.className='it';
var l=document.createElement('div');l.innerHTML='<b></b><small></small>';l.firstChild.textContent=c.n;l.lastChild.textContent=(c.l?c.l+' \u2022 ':'')+rs(c.p)+' each';
var q=document.createElement('div');q.className='q';q.innerHTML='<button data-k="'+k+'" data-a="m">\u2212</button><span>'+c.q+'</span><button data-k="'+k+'" data-a="p">+</button>';
r.appendChild(l);r.appendChild(q);box.appendChild(r)});
$('#tot').textContent=rs(t.t)}
function send(){var t=totals();if(!t.q)return alert('Your cart is empty!');
var m="Hello Fivian! I'd like to place an order:\n",d='';
Object.keys(cart).forEach(function(k){var c=cart[k],ln='- '+c.n+(c.l?' ('+c.l+')':'')+' x'+c.q+' = '+rs(c.p*c.q);m+=ln+'\n';d+=ln+'\n'});
m+='\nEstimated total: '+rs(t.t)+' (+ delivery)\n\nName:\nDelivery address & pincode:\nDate needed (2 days notice):';
if(DISCORD_WEBHOOK){try{fetch(DISCORD_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:'New website order\n'+d+'Total '+rs(t.t)})})}catch(e){}}
window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(m),'_blank')}
function modal(id,on){$(id).hidden=!on;document.body.style.overflow=on?'hidden':''}
document.addEventListener('click',function(e){var el=e.target,card=el.closest('.card');
var b=el.closest('[data-a]');
if(b&&b.dataset.k){var k=b.dataset.k;change(k,cart[k],b.dataset.a=='p'?1:-1);return}
if(b&&card){var s=cardState(card);change(s.key,s.meta,b.dataset.a=='p'?1:-1);return}
var z=el.closest('.sz button');if(z&&card){card.dataset.sel=z.dataset.i;$$('.sz button',card).forEach(function(x){x.classList.toggle('on',x===z)});paint(card);return}
if(el.closest('#cartBtn')||el.closest('#stk')){renderCart();modal('#cartM',true);return}
var p=el.closest('[data-policy]');if(p){e.preventDefault();$$('#polM section').forEach(function(s){s.hidden=true});$('#pol-'+p.dataset.policy).hidden=false;modal('#polM',true);return}
if(el.closest('[data-close]')||el.classList.contains('ov')){modal('#cartM',false);modal('#polM',false);return}
if(el.closest('#send'))send();
if(el.closest('#clear')){cart={};save();refresh()}});
document.addEventListener('keydown',function(e){if(e.key=='Escape'){modal('#cartM',false);modal('#polM',false)}});
refresh()})();
