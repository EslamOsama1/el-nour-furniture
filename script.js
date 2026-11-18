// Add the company's real public contact details here. No visitor data is collected.
const CONTACT = {"whatsapp": "201024509097", "phone": "+201024509097", "facebook": "https://www.facebook.com/profile.php?id=100063966431111", "location": "https://maps.app.goo.gl/JmxuAXzzZYEeNX3t7", "email": "alnourcompany90@gmail.com"};
const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',uiText('فتح القائمة','Open menu'));}
menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?uiText('إغلاق القائمة','Close menu'):uiText('فتح القائمة','Open menu'));});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});


const filters=[...document.querySelectorAll('[data-filter]')];
const panels=[...document.querySelectorAll('.work-panel')];
const projects=[...document.querySelectorAll('.project')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function setSlide(panel,index,scroll=true){const track=panel.querySelector('.work-track');const cards=[...track.querySelectorAll(':scope > .project')];index=Math.max(0,Math.min(index,cards.length-1));panel.dataset.index=String(index);panel.querySelector('.slide-prev').disabled=index===0;panel.querySelector('.slide-next').disabled=index===cards.length-1;panel.querySelectorAll('.slide-dot').forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-pressed',String(i===index));});if(scroll)cards[index].scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',inline:'start',block:'nearest'});}
function selectFilter(category){const chosen=panels.find(p=>p.dataset.panel===category);if(!chosen)return;panels.forEach(p=>{p.hidden=p!==chosen;});filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});chosen.querySelector('.work-track').scrollTo({left:0,behavior:'instant'});setSlide(chosen,0,false);}
filters.forEach(button=>button.addEventListener('click',()=>selectFilter(button.dataset.filter)));
document.querySelectorAll('[data-select]').forEach(link=>link.addEventListener('click',()=>selectFilter(link.dataset.select)));
panels.forEach(panel=>{const track=panel.querySelector('.work-track');setSlide(panel,0,false);panel.querySelector('.slide-prev').addEventListener('click',()=>setSlide(panel,Number(panel.dataset.index)-1));panel.querySelector('.slide-next').addEventListener('click',()=>setSlide(panel,Number(panel.dataset.index)+1));panel.querySelectorAll('.slide-dot').forEach(dot=>dot.addEventListener('click',()=>setSlide(panel,Number(dot.dataset.index))));track.addEventListener('keydown',event=>{if(event.target!==track)return;const current=Number(panel.dataset.index);if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setSlide(panel,event.key==='Home'?0:event.key==='End'?track.querySelectorAll(':scope > .project').length-1:current+(event.key==='ArrowLeft'?1:-1));}});let pending=false,lastUpdate=-Infinity;track.addEventListener('scroll',()=>{if(pending||panel.hidden)return;pending=true;requestAnimationFrame(now=>{pending=false;if(track.classList.contains('auto-moving')&&now-lastUpdate<120)return;lastUpdate=now;const box=track.getBoundingClientRect();const leading=box.right;let closest=0,distance=Infinity;track.querySelectorAll(':scope > .project').forEach((card,i)=>{const r=card.getBoundingClientRect();const d=Math.abs(r.right-leading);if(d<distance){distance=d;closest=i;}});if(Math.abs(track.scrollLeft)>=track.scrollWidth-track.clientWidth-2)closest=track.querySelectorAll(':scope > .project').length-1;if(closest!==Number(panel.dataset.index))setSlide(panel,closest,false);});},{passive:true});let dragging=false,origin=0,initial=0,moved=false,suppressClick=false;track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;dragging=true;origin=event.clientX;initial=track.scrollLeft;moved=false;});track.addEventListener('pointermove',event=>{if(!dragging)return;const dx=event.clientX-origin;if(Math.abs(dx)>7&&!moved){moved=true;track.setPointerCapture(event.pointerId);track.classList.add('dragging');}if(moved){event.preventDefault();track.scrollLeft=initial-dx;}});function release(){if(!dragging)return;dragging=false;track.classList.remove('dragging');if(moved){suppressClick=true;setTimeout(()=>suppressClick=false,0);const box=track.getBoundingClientRect();const leading=box.right;let nearest=0,distance=Infinity;track.querySelectorAll(':scope > .project').forEach((card,i)=>{const r=card.getBoundingClientRect(),d=Math.abs(r.right-leading);if(d<distance){distance=d;nearest=i;}});setSlide(panel,nearest);}}track.addEventListener('pointerup',release);track.addEventListener('pointercancel',release);track.addEventListener('pointerleave',()=>{if(!moved)dragging=false;});track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},true);});
const lightbox=document.querySelector('.lightbox');
let currentProject;
document.addEventListener('site-language-change', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', open ? uiText('إغلاق القائمة', 'Close menu') : uiText('فتح القائمة', 'Open menu'));
  if (lightbox.open && currentProject) showProject(currentProject);
});
function showProject(project){currentProject=project;const image=lightbox.querySelector('.lightbox-image');image.src=project.dataset.src;image.alt=project.dataset.title;document.querySelector('#lightbox-title').textContent=project.dataset.title;lightbox.querySelector('.lightbox-caption').textContent=project.dataset.label + (project.dataset.label === uiText('صورة مرجعية', 'Reference Photo') ? '' : ' · ' + uiText('من أعمال النور للأثاث', 'Work by El Nour Furniture'));}
projects.forEach(project=>project.addEventListener('click',()=>{showProject(project);lightbox.showModal();document.body.style.overflow='hidden';}));
lightbox.querySelector('.close-modal').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('close',()=>{document.body.style.overflow='';});
lightbox.addEventListener('click',event=>{if(event.target===lightbox){const box=lightbox.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)lightbox.close();}});

/* Repeat the active row while keeping the original cards available to the keyboard. */
panels.forEach(panel => {
  const track = panel.querySelector('.work-track');
  const cards = [...track.children];
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'slide-pause';

  panel.querySelector('.carousel-controls').append(pause);

  // Keep the existing manual controls on the original cards.
  const repeat = document.createElement('div');
  repeat.className = 'work-repeat';
  repeat.setAttribute('aria-hidden', 'true');
  cards.forEach(card => {
    const copy = card.cloneNode(true);
    copy.tabIndex = -1;
    copy.addEventListener('click', () => card.click());
    repeat.append(copy);
  });
  track.append(repeat);
  let paused = false;
  let hovering = false;
  let resumeAt = 0;
  let lastTime = 0;
  let position = NaN;
  let cycle = 0;
  let viewportWidth = 0;
  let touching = false;
  let moving = false;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const layout = new ResizeObserver(() => {
    viewportWidth = track.clientWidth;
    cycle = Math.abs(cards[0].getBoundingClientRect().right - repeat.getBoundingClientRect().right);
    position = NaN;
  });
  layout.observe(track);
  layout.observe(repeat);

  function syncPauseLabel() {
    pause.textContent = paused ? uiText('تشغيل الحركة', 'Play') : uiText('إيقاف الحركة', 'Pause');
  }
  document.addEventListener('site-language-change', syncPauseLabel);
  pause.addEventListener('click', () => {
    paused = !paused;
    syncPauseLabel();
  });
  track.addEventListener('mouseenter', () => { hovering = finePointer.matches; });
  track.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  function finishTouch(event) {
    touching = event.touches.length > 0;
    resumeAt = performance.now() + 3000;
  }
  track.addEventListener('touchend', finishTouch, { passive: true });
  track.addEventListener('touchcancel', finishTouch, { passive: true });
  track.addEventListener('mouseleave', () => { hovering = false; });
  panel.addEventListener('pointerdown', () => { resumeAt = performance.now() + 3000; });
  panel.addEventListener('keydown', () => { resumeAt = performance.now() + 3000; });
  track.addEventListener('wheel', () => { resumeAt = performance.now() + 3000; }, { passive: true });

  function move(now) {
    const elapsed = Math.min(now - lastTime, 34);
    lastTime = now;
    const active = viewportWidth > 0 && cycle >= viewportWidth && !panel.hidden &&
      !reduceMotion.matches && !paused && !hovering && !touching && now >= resumeAt &&
      !lightbox.open && !panel.querySelector(':focus-visible');
    if (active !== moving) {
      moving = active;
      track.classList.toggle('auto-moving', active);
    }
    if (active) {
      if (!Number.isFinite(position) || Math.abs(position - track.scrollLeft) > 1) {
        position = track.scrollLeft;
      }
      position += elapsed * (finePointer.matches ? 0.045 : 0.028);
      if (position >= 0) position -= cycle;
      track.scrollLeft = position;
    } else {
      position = NaN;
    }
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
});
