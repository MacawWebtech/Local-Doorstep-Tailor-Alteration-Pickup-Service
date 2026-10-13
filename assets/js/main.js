const body=document.body;
const theme=document.querySelector('#theme');
const rtl=document.querySelector('#rtl');
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('nav');
function read(key){try{return localStorage.getItem(key)}catch{return null}}
function save(key,value){try{localStorage.setItem(key,value)}catch{}}
function setTheme(dark){body.classList.toggle('dark',dark);theme.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');theme.textContent=dark?'☀':'◐'}
setTheme(read('stackly-theme')?read('stackly-theme')==='dark':matchMedia('(prefers-color-scheme: dark)').matches);
theme.addEventListener('click',()=>{setTheme(!body.classList.contains('dark'));save('stackly-theme',body.classList.contains('dark')?'dark':'light')});
function setRTL(value){body.classList.toggle('mirrored',value);rtl.setAttribute('aria-pressed',String(value))}
setRTL(read('stackly-rtl')==='true');rtl.addEventListener('click',()=>{setRTL(!body.classList.contains('mirrored'));save('stackly-rtl',String(body.classList.contains('mirrored')))});
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus()}});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  body.classList.add('js-motion');
  const motionSelector = 'main .reveal, main .section-heading, main .content-card, main .service-card, main .feature-media, main .faq > div:first-child, main .article-advice, main .tip-grid > article, main .estimate-grid > article, main .care-points > article, main .journey-grid > article, main .home2-image, main .garment, main .stat, main .request-card, main .measurement-card, main .empty-state, main .testimonial-card, main .auth-intro, main .auth-shell > .panel, main .end-cta > h2, main .dark-feature > h2';
  const observed = new WeakSet();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.05 });
  function observeMotion(scope) {
    const targets = [...scope.querySelectorAll(motionSelector)];
    if (scope.matches && scope.matches(motionSelector)) targets.unshift(scope);
    targets.forEach(target => {
      if (observed.has(target)) return;
      observed.add(target);
      target.classList.add('motion-target');
      observer.observe(target);
    });
  }
  observeMotion(document);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) observeMotion(node);
  }))).observe(document.querySelector('main'), { childList: true, subtree: true });
}
const form=document.querySelector('#pickup-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const text=`Tailoring enquiry\nName: ${data.get('name')}\nService: ${data.get('service')}\nRequirements: ${data.get('requirements')}`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='tailoring-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);form.querySelector('.form-status').textContent='Your enquiry has been downloaded. No pickup has been booked yet.'});

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;card.classList.add('visible')})}));
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{const field=document.querySelector('[name="requirements"]');if(field)field.value=link.dataset.service+' — ';}));

// Keep expanded mobile navigation inside the available viewport.
{
 const siteHeader = document.querySelector('header');
 let pendingNavFrame = false;
 const sizeNavigation = () => {
  pendingNavFrame = false;
  if (matchMedia('(max-width: 900px)').matches) nav.style.maxHeight = Math.max(0, innerHeight - siteHeader.getBoundingClientRect().bottom) + 'px';
  else nav.style.removeProperty('max-height');
 };
 const scheduleNavigation = () => { if (!pendingNavFrame) { pendingNavFrame = true; requestAnimationFrame(sizeNavigation); } };
 sizeNavigation();
 window.addEventListener('resize', scheduleNavigation);
 window.addEventListener('scroll', scheduleNavigation, { passive: true });
 if ('ResizeObserver' in window) new ResizeObserver(scheduleNavigation).observe(siteHeader);
}
