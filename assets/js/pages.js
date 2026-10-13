'use strict';
const services = window.STITCH_SERVICES || [];
const articles = window.STITCH_ARTICLES || [];
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
function getData(key, fallback) { try { return JSON.parse(localStorage.getItem('stitchdoor-' + key)) ?? fallback; } catch { return fallback; } }
function putData(key, value) { try { localStorage.setItem('stitchdoor-' + key, JSON.stringify(value)); return true; } catch { return false; } }
function safe(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function download(name, text) { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
const path = location.pathname.split('/').pop() || 'index.html';
$$('nav a').forEach(a => { if (a.getAttribute('href') === path) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); const group = a.closest('.nav-group'); if(group) $('.nav-trigger',group).classList.add('active'); } });
$$('.nav-trigger').forEach(button => button.addEventListener('click', () => { const target = document.getElementById(button.getAttribute('aria-controls')); const open = target.hidden; $$('.dropdown').forEach(d => d.hidden = true); $$('.nav-trigger').forEach(b => b.setAttribute('aria-expanded', 'false')); target.hidden = !open; button.setAttribute('aria-expanded', String(open)); }));
document.addEventListener('click', e => { if (!e.target.closest('.nav-group')) { $$('.dropdown').forEach(d => d.hidden = true); $$('.nav-trigger').forEach(b => b.setAttribute('aria-expanded','false')); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $$('.dropdown').forEach(d => d.hidden = true); $$('.nav-trigger').forEach(b => b.setAttribute('aria-expanded','false')); } });
const params = new URLSearchParams(location.search);
function queryIndex(key, max) { const v = Number(params.get(key)); return Number.isInteger(v) && v >= 0 && v < max ? v : 0; }
if ($('#service-detail')) {
  const i = queryIndex('service',services.length), s = services[i];
  $('#detail-title').textContent = s[0]; $('#detail-description').textContent = s[1]; $('#detail-price').textContent = 'Illustrative estimate from ' + money(s[2]);
  $('#detail-image').src = `assets/images/services/service-${i+1}.jpg`; $('#detail-image').alt = s[0] + ' illustration'; $('#detail-book').href = `book-pickup.html?service=${i}`;
}
if ($('#article-grid')) {
  let page = 0; const size = 6;
  function renderArticles() {
    const q = $('#blog-search').value.toLowerCase().trim(), cat = $('#blog-category').value;
    const filtered = articles.map((a,i)=>({a,i})).filter(({a}) => (cat === 'all' || a[1] === cat) && a.join(' ').toLowerCase().includes(q));
    const pages = Math.max(1,Math.ceil(filtered.length/size)); page = Math.min(page,pages-1);
    $('#article-grid').innerHTML = filtered.slice(page*size,(page+1)*size).map(({a,i})=>`<article class="content-card"><img loading="lazy" src="assets/images/blog/article-${i+1}.jpg" alt="${safe(a[0])} illustration" width="1000" height="800"><p class="eyebrow">${safe(a[1])} / 5 MIN READ</p><h3>${safe(a[0])}</h3><p>${safe(a[2])}</p><a class="secondary" href="blog-details.html?article=${i}">Read article ↗</a></article>`).join('');
    $('#blog-empty').hidden = filtered.length > 0; $('#blog-page').textContent = `Page ${page+1} of ${pages}`; $('#blog-prev').disabled = page === 0; $('#blog-next').disabled = page === pages-1;
  }
  $('#blog-search').addEventListener('input',()=>{page=0;renderArticles();}); $('#blog-category').addEventListener('change',()=>{page=0;renderArticles();});
  $('#blog-prev').addEventListener('click',()=>{page--;renderArticles();}); $('#blog-next').addEventListener('click',()=>{page++;renderArticles();}); renderArticles();
}
if ($('#article-title')) {
  const i=queryIndex('article',articles.length), a=articles[i]; $('#article-title').textContent=a[0]; $('#article-category').textContent=a[1]; $('#article-lead').textContent=a[2]; $('#article-image').src=`assets/images/blog/article-${i+1}.jpg`; $('#article-image').alt=a[0]+' illustration'; $('#article-next').href=`blog-details.html?article=${(i+1)%articles.length}`;
  $('#share-article').addEventListener('click', async()=>{ try { if(navigator.share) await navigator.share({title:a[0],url:location.href}); else if(navigator.clipboard) {await navigator.clipboard.writeText(location.href);$('#share-status').textContent='Article link copied.';} else $('#share-status').textContent=location.href; } catch { $('#share-status').textContent='Sharing cancelled or unavailable.'; } });
}
$$('[data-password]').forEach(b=>b.addEventListener('click',()=>{const input=$('input',b.parentElement);input.type=input.type==='password'?'text':'password';b.textContent=input.type==='password'?'Show':'Hide';}));
if ($('#forgot-password')) $('#forgot-password').addEventListener('click',()=>$('#auth-message').textContent='Password recovery requires a connected account service. This local workspace does not store passwords.');
if ($('#login-form')) {
  const f=$('#login-form'), remembered=getData('remembered-email',''); if(remembered) f.elements.email.value=remembered;
  f.addEventListener('submit',e=>{e.preventDefault(); const profile=getData('profile',{}); profile.email=f.elements.email.value; if(!putData('profile',profile)){ $('#auth-message').textContent='Browser storage is unavailable. Please enable storage to use this workspace.';return;} if(f.elements.remember.checked)putData('remembered-email',profile.email);else putData('remembered-email','');f.elements.password.value='';location.href='dashboard.html';});
}
if ($('#register-form')) {
  const f=$('#register-form'); f.addEventListener('submit',e=>{e.preventDefault();if(f.elements.password.value!==f.elements.confirm.value){$('#auth-message').textContent='Passwords do not match.';f.elements.confirm.focus();return;}const p={name:f.elements.name.value,email:f.elements.email.value,phone:f.elements.phone.value};if(!putData('profile',p)){$('#auth-message').textContent='Browser storage is unavailable.';return;}f.elements.password.value='';f.elements.confirm.value='';location.href='dashboard.html';});
}
if ($('#contact-form')) $('#contact-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;download('stitchdoor-enquiry.txt',[...new FormData(f)].map(([k,v])=>k+': '+v).join('\n'));$('.form-status',f).textContent='Enquiry downloaded. No message has been sent.';});
if ($('#map-form')) $('#map-form').addEventListener('submit',e=>{e.preventDefault();$('#area-map').src='https://maps.google.com/maps?q='+encodeURIComponent($('#map-location').value)+'&output=embed';});
if ($('#newsletter-form')) $('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const ok=putData('update-reminder',{email:f.elements.email.value,date:new Date().toISOString()});$('.form-status',f).textContent=ok?'Reminder preference saved in this browser. No newsletter subscription has been sent.':'Browser storage is unavailable.';});
const measurementKeys={Shirt:['Chest','Waist','Shoulder','Sleeve','Length'],Trousers:['Waist','Hip','Inseam','Length'],Dress:['Chest','Waist','Hip','Length'],Suit:['Chest','Waist','Shoulder','Sleeve','Inseam'],'Traditional wear':['Chest','Waist','Hip','Sleeve','Length']};
function fieldsFor(category, unit='cm', values={}) { return (measurementKeys[category]||measurementKeys.Shirt).map(k=>`<label>${k} (${safe(unit)})<input type="number" name="m_${k}" min="1" max="300" step="0.1" value="${safe(values[k]||'')}"></label>`).join(''); }
let savedBooking=null;
if ($('#booking-form')) {
  const form=$('#booking-form');let step=0;let counter=0;const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());$('#pickup-date').min=today.toISOString().slice(0,10);
  function addGarment(selected=0) {
    const entry=document.createElement('div');entry.className='garment-entry';entry.dataset.key=String(++counter);
    entry.innerHTML=`<div class="form-grid"><label>Garment type<select data-garment><option>Shirt</option><option>Trousers</option><option>Dress</option><option>Suit</option><option>Traditional wear</option></select></label><label>Quantity<input data-quantity type="number" min="1" max="25" value="1" required></label><label class="span-all">Required service<select data-garment-service>${services.map((s,i)=>`<option value="${i}" ${i===selected?'selected':''}>${safe(s[0])} — estimated ${money(s[2])}</option>`).join('')}</select></label><label>Fabric type<input data-fabric placeholder="If known"></label><label>Special instructions<textarea data-instructions rows="2" required placeholder="Describe the changes required"></textarea></label></div><button type="button" class="remove-garment">Remove garment</button>`;
    $('#garment-list').append(entry);$('.remove-garment',entry).addEventListener('click',()=>{if($$('.garment-entry').length>1){entry.remove();renderMeasurements();}else $('#booking-error').textContent='Include at least one garment.';});$('[data-garment]',entry).addEventListener('change',renderMeasurements);
    if([0,9].includes(selected))$('[data-garment]',entry).value='Trousers';else if(selected===2)$('[data-garment]',entry).value='Dress';else if(selected===3)$('[data-garment]',entry).value='Suit';else if([4,5].includes(selected))$('[data-garment]',entry).value='Traditional wear';
  }
  function garments() { return $$('.garment-entry').map(e=>({type:$('[data-garment]',e).value,quantity:Number($('[data-quantity]',e).value),service:Number($('[data-garment-service]',e).value),fabric:$('[data-fabric]',e).value,instructions:$('[data-instructions]',e).value})); }
  function renderMeasurements() {
    const prior=Object.fromEntries($$('[data-measurement-category]').map(e=>[e.dataset.measurementCategory,Object.fromEntries($$('input',e).filter(i=>i.value).map(i=>[i.name.slice(2),i.value]))]));
    const mode=$('#measurement-mode').value;
    if(mode==='new') { const categories=[...new Set(garments().map(g=>g.type))];$('#booking-measurements').innerHTML='<p>Provide only the dimensions relevant to your request. You can leave unknown values blank and request assistance in the notes.</p>'+categories.map(c=>`<fieldset data-measurement-category="${safe(c)}"><legend>${safe(c)}</legend><div class="form-grid">${fieldsFor(c,'cm',prior[c]||{})}</div></fieldset>`).join(''); }
    else if(mode==='saved') {const ms=getData('measurements',[]);$('#booking-measurements').innerHTML=ms.length?`<label>Saved profile<select id="saved-measurement">${ms.map(m=>`<option value="${safe(m.id)}">${safe(m.name)} — ${safe(m.category)}</option>`).join('')}</select></label>`:'<p>No measurements are saved yet. Choose another option or create a measurement profile in your dashboard.</p>';}
    else $('#booking-measurements').innerHTML='<p>Measurement assistance requested. Confirm how measurements will be reviewed before work starts.</p>';
  }
  function requestData() {
    const values=Object.fromEntries(new FormData(form)); const gs=garments();let measurements=[];
    if(values.measurementMode==='new')measurements=$$('[data-measurement-category]').map(e=>({category:e.dataset.measurementCategory,unit:'cm',values:Object.fromEntries($$('input',e).filter(i=>i.value).map(i=>[i.name.slice(2),Number(i.value)]))}));
    if(values.measurementMode==='saved'){const id=$('#saved-measurement')?.value;measurements=getData('measurements',[]).filter(m=>m.id===id);}
    return {...values,garments:gs,measurements,estimate:gs.reduce((sum,g)=>sum+services[g.service][2]*g.quantity,0),status:'Pickup requested'};
  }
  function review(data) {return `<div class="review-grid"><div><h3>Garments</h3>${data.garments.map(g=>`<p>${g.quantity} × ${safe(g.type)}: ${safe(services[g.service][0])}<br>${safe(g.instructions)}</p>`).join('')}</div><div><h3>Pickup</h3><p>${safe(data.customer)}<br>${safe(data.phone)}<br>${safe(data.address)}<br>${safe(data.city)} ${safe(data.postal)}</p></div><div><h3>Preferences</h3><p>${safe(data.pickupDate)}<br>${safe(data.window)}<br>${safe(data.scheduleNotes)}</p></div><div><h3>Measurements</h3><p>${safe(data.measurementMode)}<br>${safe(data.measurementNotes)}</p>${data.measurements.map(m=>`<p>${safe(m.category)}: ${safe(Object.entries(m.values||{}).map(([k,v])=>k+' '+v+' '+m.unit).join(', '))}</p>`).join('')}</div></div><h3>Illustrative estimate: ${money(data.estimate)}</h3>`;}
  function showStep() {$$('[data-step]').forEach(s=>s.hidden=Number(s.dataset.step)!==step);$$('[data-progress]').forEach(s=>{s.classList.toggle('current',Number(s.dataset.progress)===step);if(Number(s.dataset.progress)===step)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');});$('#booking-prev').hidden=step===0||step===6;$('#booking-next').hidden=step===6;$('#booking-next').textContent=step===5?'Save local request':'Continue →';$('#booking-error').textContent='';if(step===2)renderMeasurements();if(step===5)$('#booking-review').innerHTML=review(requestData());}
  function validStep() {const current=$(`[data-step="${step}"]`);for(const input of $$('input,select,textarea',current)){if(!input.checkValidity()){input.reportValidity();return false;}}if(step===2&&$('#measurement-mode').value==='saved'&&!$('#saved-measurement')){$('#booking-error').textContent='Select a saved measurement profile or choose another measurement option.';return false;}return true;}
  $('#add-garment').addEventListener('click',()=>addGarment());$('#measurement-mode').addEventListener('change',renderMeasurements);
  $('#booking-next').addEventListener('click',()=>{if(!validStep())return;if(step===5){const data=requestData();const list=getData('bookings',[]);data.id='SD-'+Date.now().toString(36).toUpperCase();data.createdAt=new Date().toISOString();if(!putData('bookings',[data,...list])){$('#booking-error').textContent='Browser storage is unavailable. Your request has not been saved.';return;}savedBooking=data;$('#booking-reference').textContent='Reference: '+data.id+'. This request is local-only and needs service-team confirmation.';}step++;showStep();});
  $('#booking-prev').addEventListener('click',()=>{step=Math.max(0,step-1);showStep();});form.addEventListener('submit',e=>e.preventDefault());$('#download-booking').addEventListener('click',()=>{if(savedBooking)download(savedBooking.id+'.txt',JSON.stringify(savedBooking,null,2));});addGarment(queryIndex('service',services.length));showStep();
}
if($('.dashboard-shell')) {
  const bookings=()=>getData('bookings',[]);let selectedTab='overview';
  function empty(text) { return `<div class="empty-state"><p>${safe(text)}</p><a class="secondary" href="book-pickup.html">Prepare a pickup request ↗</a></div>`; }
  function requestCard(b) {return `<article class="request-card"><h3>${safe(b.id)}</h3><p>${safe(b.status)} · preferred ${safe(b.pickupDate)} · ${money(b.estimate)} estimate</p><p>${b.garments.map(g=>safe(g.quantity+' × '+g.type+' — '+services[g.service][0])).join('<br>')}</p><details><summary>View request details</summary><p>${safe(b.customer)} · ${safe(b.phone)}<br>${safe(b.address)}, ${safe(b.city)} ${safe(b.postal)}<br>${safe(b.window)}</p>${b.garments.map(g=>`<p>${safe(g.instructions)}</p>`).join('')}</details><div class="card-actions"><button class="secondary" data-export="${safe(b.id)}">Download request</button><a href="book-pickup.html?service=${b.garments[0]?.service||0}">Repeat service ↗</a></div></article>`;}
  function refresh() {
    const bs=bookings(), done=bs.filter(b=>b.status==='Delivered').length;const values=[['Total requests',bs.length],['Active requests',bs.length-done],['Completed jobs',done],['Confirmed pickups',bs.filter(b=>b.status==='Pickup scheduled').length],['Pending estimates',money(bs.reduce((n,b)=>n+b.estimate,0))],['Saved measurements',getData('measurements',[]).length]];
    $('#dashboard-stats').innerHTML=values.map(([t,v])=>`<div class="stat"><strong>${safe(v)}</strong><span>${t}</span></div>`).join('');$('#recent-activity').innerHTML=bs.length?bs.slice(0,3).map(requestCard).join(''):empty('No garment requests are saved yet.');
    const filter=$('#booking-filter').value;const filtered=bs.filter(b=>filter==='all'||b.status===filter);$('#dashboard-bookings').innerHTML=filtered.length?filtered.map(requestCard).join(''):empty('No requests match this status.');
    const chosen=$('#tracking-booking').value;$('#tracking-booking').innerHTML=bs.map(b=>`<option value="${safe(b.id)}">${safe(b.id)}</option>`).join('');if(bs.some(b=>b.id===chosen))$('#tracking-booking').value=chosen;renderTracking();
    const history=bs.filter(b=>b.status==='Delivered');$('#garment-history').innerHTML=history.length?history.map(requestCard).join(''):empty('No completed garment services are recorded.');
    $('#payment-list').innerHTML=bs.length?bs.map(b=>`<article class="request-card"><h3>${safe(b.id)}</h3><p>Illustrative estimate: ${money(b.estimate)}</p><p>No payment recorded. No invoice issued.</p><button class="secondary" data-export="${safe(b.id)}">Download request estimate</button></article>`).join(''):empty('No payment or invoice records are available.');
    $('#notification-list').innerHTML=bs.length?bs.map(b=>`<article class="request-card"><h3>Request saved: ${safe(b.id)}</h3><p>${safe(new Date(b.createdAt).toLocaleString())}</p><p>Your request is saved in this browser. Pickup needs separate confirmation.</p></article>`).join(''):'<p class="empty-state">No notifications yet.</p>';
    $$('[data-export]').forEach(btn=>btn.addEventListener('click',()=>{const b=bs.find(x=>x.id===btn.dataset.export);if(b)download(b.id+'.txt',JSON.stringify(b,null,2));}));renderMeasurementsList();
  }
  function renderTracking() {const b=bookings().find(x=>x.id===$('#tracking-booking').value);if(!b){$('#tracking-stages').innerHTML=empty('Choose or create a request to see its saved stage.');return;}const stages=['Pickup requested','Pickup scheduled','Garment collected','Measurement review','Alteration in progress','Quality check','Ready for delivery','Delivered'];const current=Math.max(0,stages.indexOf(b.status));$('#tracking-stages').innerHTML=stages.map((t,i)=>`<div class="tracking-stage ${i===current?'current':''}"><span>${i+1}</span><p>${t}${i===current?' — saved stage':''}${i>current?' — awaiting confirmation':''}</p></div>`).join('');}
  function setTab(name){selectedTab=name;$$('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==name);$$('[data-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.tab===name);b.setAttribute('aria-pressed',String(b.dataset.tab===name));});}
  $$('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));$('#booking-filter').addEventListener('change',refresh);$('#tracking-booking').addEventListener('change',renderTracking);
  const mf=$('#measurement-form');function renderFields(values={}) {$('#measurement-fields').innerHTML=fieldsFor(mf.elements.category.value,mf.elements.unit.value,values);}
  function renderMeasurementsList(){const ms=getData('measurements',[]);$('#measurement-list').innerHTML=ms.length?ms.map(m=>`<article class="measurement-card"><h3>${safe(m.name)} — ${safe(m.category)}</h3><p>${safe(Object.entries(m.values).map(([k,v])=>k+': '+v+' '+m.unit).join(' · '))}</p><p>${safe(m.notes)}</p><div class="card-actions"><button class="secondary" data-edit="${safe(m.id)}">Edit</button><button class="secondary" data-delete="${safe(m.id)}">Delete</button></div></article>`).join(''):'<p class="empty-state">No measurement profiles saved.</p>';$$('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>{const m=ms.find(x=>x.id===btn.dataset.edit);mf.elements.id.value=m.id;mf.elements.name.value=m.name;mf.elements.category.value=m.category;mf.elements.unit.value=m.unit;mf.elements.notes.value=m.notes;renderFields(m.values);mf.elements.name.focus();}));$$('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{putData('measurements',ms.filter(m=>m.id!==btn.dataset.delete));refresh();}));}
  mf.elements.category.addEventListener('change',()=>renderFields());mf.elements.unit.addEventListener('change',()=>renderFields());$('#measurement-reset').addEventListener('click',()=>{mf.reset();mf.elements.id.value='';renderFields();});
  mf.addEventListener('submit',e=>{e.preventDefault();const values=Object.fromEntries($$('input[name^="m_"]',mf).filter(i=>i.value).map(i=>[i.name.slice(2),Number(i.value)]));if(!Object.keys(values).length){$('.form-status',mf).textContent='Add at least one relevant measurement.';return;}const m={id:mf.elements.id.value||'M-'+Date.now(),name:mf.elements.name.value,category:mf.elements.category.value,unit:mf.elements.unit.value,notes:mf.elements.notes.value,values};const ms=getData('measurements',[]).filter(x=>x.id!==m.id);if(!putData('measurements',[m,...ms])){$('.form-status',mf).textContent='Browser storage unavailable.';return;}mf.reset();mf.elements.id.value='';renderFields();$('.form-status',mf).textContent='Measurement profile saved on this device.';refresh();});
  const pf=$('#profile-form'),profile=getData('profile',{});Object.entries(profile).forEach(([k,v])=>{if(pf.elements[k])pf.elements[k].value=v;});pf.addEventListener('submit',e=>{e.preventDefault();const ok=putData('profile',Object.fromEntries(new FormData(pf)));$('.form-status',pf).textContent=ok?'Profile saved on this device.':'Browser storage is unavailable.';});$('#logout').addEventListener('click',()=>{putData('remembered-email','');location.href='login.html';});renderFields();refresh();setTab(['overview','bookings','tracking','measurements','history','payments','notifications','profile'].includes(location.hash.slice(1))?location.hash.slice(1):'overview');
}

// Match the sticky dashboard navigation to the actual header height.
if (document.querySelector('.dashboard-shell')) {
  const dashboardHeader = document.querySelector('header');
  const updateDashboardOffset = () => document.documentElement.style.setProperty('--dashboard-header-height', dashboardHeader.getBoundingClientRect().height + 'px');
  updateDashboardOffset();
  if ('ResizeObserver' in window) new ResizeObserver(updateDashboardOffset).observe(dashboardHeader);
  else window.addEventListener('resize', updateDashboardOffset);
}
