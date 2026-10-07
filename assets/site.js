(function(){
var KEY='fivian_cart_v2',WA='919088055818',DISCORD_WEBHOOK='https://discord.com/api/webhooks/1548727130454761502/uQbUb9BvtlTtMTnQ_p2pIy8NpEg0-giznGYbSz53Ux3ASdwYvndbcUNYli1yaNMSc_fh';
try{localStorage.removeItem('fivian_cart')}catch(e){}
var cart={};try{cart=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var rs=function(n){return'\u20B9'+n};
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
function totals(){var q=0,t=0;for(var k in cart){q+=cart[k].q;t+=cart[k].q*cart[k].p}return{q:q,t:t}}
function change(key,meta,d){var c=cart[key]||(cart[key]={n:meta.n,l:meta.l,p:meta.p,q:0});c.q+=d;if(c.q<=0)delete cart[key];save();refresh()}
function cardState(card){var v=JSON.parse(card.dataset.v),i=+(card.dataset.sel||0),x=v[i];return{v:v,x:x,i:i,key:card.dataset.id+'|'+x.k,meta:{n:card.dataset.name,l:x.l,p:x.p}}}
function paint(card,skipAct){var s=cardState(card),x=s.x,q=cart[s.key]?cart[s.key].q:0;
$$('.ph img',card).forEach(function(im,n){im.classList.toggle('on',n==s.i)});$$('.sz button',card).forEach(function(z,n){z.classList.toggle('on',n==s.i)});var tg=$('.tag',card);if(x.w&&x.w>x.p){tg.hidden=false;tg.textContent=Math.round((1-x.p/x.w)*100)+'% off'}else tg.hidden=true;
$('.pr',card).innerHTML=(x.w&&x.w>x.p?'<del>'+rs(x.w)+'</del>':'')+rs(x.p)+(x.l&&s.v.length==1?'<small>'+x.l+'</small>':'');
if(skipAct)return;$('.act',card).innerHTML=q?'<div class="q"><button data-a="m" aria-label="Remove one">\u2212</button><span>'+q+'</span><button data-a="p" aria-label="Add one">+</button></div>':'<button class="add" data-a="p">+ Add</button>'}
function refresh(){var t=totals();$('#cnt').textContent=t.q;$$('.card').forEach(function(c){paint(c)});var s=$('#stk');s.hidden=!t.q;s.textContent='\uD83D\uDED2 View Cart \u2022 '+t.q+' item'+(t.q>1?'s':'')+' \u2022 '+rs(t.t);if(!$('#cartM').hidden)renderCart()}
function renderCart(){var box=$('#items'),t=totals();box.innerHTML='';
if(!t.q){box.innerHTML='<p class="emp">Your cart is empty. Add something sweet!</p>'}
Object.keys(cart).forEach(function(k){var c=cart[k],r=document.createElement('div');r.className='it';
var l=document.createElement('div');l.innerHTML='<b></b><small></small>';l.firstChild.textContent=c.n;l.lastChild.textContent=(c.l?c.l+' \u2022 ':'')+rs(c.p)+' each';
var q=document.createElement('div');q.className='q';q.innerHTML='<button data-k="'+k+'" data-a="m">\u2212</button><span>'+c.q+'</span><button data-k="'+k+'" data-a="p">+</button>';
r.appendChild(l);r.appendChild(q);box.appendChild(r)});
$('#tot').textContent=rs(t.t)}
function send(){var t=totals();if(!t.q)return alert('Your cart is empty!');
var n=$('#fn').value.trim(),ph=$('#fp').value.trim(),ad=$('#fa').value.trim(),er=$('#er');
var msg=!n?'Please enter your name.':ph.replace(/\D/g,'').length<10?'Please enter a valid phone number.':!ad?'Please enter your delivery address.':'';
if(msg){er.textContent=msg;er.hidden=false;return}er.hidden=true;
try{localStorage.setItem(KEY+'_c',JSON.stringify({n:n,p:ph,a:ad}))}catch(e){}
var d='';Object.keys(cart).forEach(function(k){var c=cart[k];d+='- '+c.n+(c.l?' ('+c.l+')':'')+' x'+c.q+' = '+rs(c.p*c.q)+'\n'});
var m="Hello Fivian! I'd like to place an order:\n"+d+'\nEstimated total: '+rs(t.t)+' (+ delivery)\n\nName: '+n+'\nPhone: '+ph+'\nAddress: '+ad;
if(DISCORD_WEBHOOK){try{fetch(DISCORD_WEBHOOK,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({embeds:[{title:'New Website Order',color:13112366,fields:[{name:'Customer',value:n,inline:true},{name:'Phone',value:ph,inline:true},{name:'Address',value:ad.slice(0,1000)},{name:'Items',value:d.slice(0,1000)},{name:'Estimated Total',value:rs(t.t)+' (+ delivery)'}]}]})})}catch(e){}}
window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(m),'_blank')}
function sendContact(){var n=$('#cn').value.trim(),p=$('#cp').value.trim(),e=$('#ce').value.trim(),m=$('#cm').value.trim(),er=$('#cerr'),ok=$('#cok'),bt=$('#csend');ok.hidden=true;
var msg=!n?'Please enter your name.':p.replace(/\D/g,'').length<10?'Please enter a valid phone number.':!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)?'Please enter a valid email address.':'';
if(msg){er.textContent=msg;er.hidden=false;return}er.hidden=true;bt.disabled=true;bt.textContent='Sending...';
fetch(DISCORD_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({embeds:[{title:'New Contact Enquiry',color:13112366,fields:[{name:'Name',value:n,inline:true},{name:'Phone',value:p,inline:true},{name:'Email',value:e},{name:'Message',value:(m||'(none)').slice(0,1000)}]}]})}).then(function(r){if(!r.ok)throw 0;['#cn','#cp','#ce','#cm'].forEach(function(s){$(s).value=''});ok.hidden=false}).catch(function(){er.textContent='Sorry, that did not send. Please WhatsApp us instead.';er.hidden=false}).then(function(){bt.disabled=false;bt.textContent='Send Message'})}
function modal(id,on){$(id).hidden=!on;document.body.style.overflow=on?'hidden':''}
document.addEventListener('click',function(e){var el=e.target,card=el.closest('.card');
var b=el.closest('[data-a]');
if(b&&b.dataset.k){var k=b.dataset.k;change(k,cart[k],b.dataset.a=='p'?1:-1);return}
if(b&&card){card.dataset.man=1;var s=cardState(card);change(s.key,s.meta,b.dataset.a=='p'?1:-1);return}
var z=el.closest('.sz button');if(z&&card){card.dataset.man=1;card.dataset.sel=z.dataset.i;$$('.sz button',card).forEach(function(x){x.classList.toggle('on',x===z)});paint(card);return}
if(el.closest('#cartBtn')||el.closest('#stk')){renderCart();modal('#cartM',true);return}
var p=el.closest('[data-policy]');if(p){e.preventDefault();$$('#polM section').forEach(function(s){s.hidden=true});$('#pol-'+p.dataset.policy).hidden=false;modal('#polM',true);return}
if(el.closest('[data-fclose]')){modal('#folM',false);return}
if(el.closest('[data-close]')||el.classList.contains('ov')){modal('#cartM',false);modal('#polM',false);modal('#folM',false);return}
if(el.closest('#csend')){sendContact();return}
if(el.closest('#send'))send();
if(el.closest('#clear')){cart={};save();refresh()}});
document.addEventListener('keydown',function(e){if(e.key=='Escape'){modal('#cartM',false);modal('#polM',false)}});
$$('.card').forEach(function(c){var v=JSON.parse(c.dataset.v);v.slice(1).forEach(function(x){var im=new Image();im.src=x.i;im.alt=c.dataset.name+' '+x.l;$('.ph',c).appendChild(im)})});
try{var sv=JSON.parse(localStorage.getItem(KEY+'_c')||'{}');$('#fn').value=sv.n||'';$('#fp').value=sv.p||'';$('#fa').value=sv.a||''}catch(e){}
setInterval(function(){$$('.card').forEach(function(c){var v=JSON.parse(c.dataset.v);if(v.length<2||c.dataset.man||c.matches(':hover'))return;if(Object.keys(cart).some(function(k){return k.indexOf(c.dataset.id+'|')==0}))return;c.dataset.sel=((+c.dataset.sel||0)+1)%v.length;paint(c,true)})},3000);
function follow(){var s=0;try{s=sessionStorage.getItem('fivianFollowSeen')}catch(e){}if(s)return;if(!$('#cartM').hidden||!$('#polM').hidden)return setTimeout(follow,3000);try{sessionStorage.setItem('fivianFollowSeen','1')}catch(e){}modal('#folM',true)}
setTimeout(follow,6000);refresh()})();
