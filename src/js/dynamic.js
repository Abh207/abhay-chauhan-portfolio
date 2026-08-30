
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // Typing effect
  const typing = $('.typing-text');
  if (typing) {
    const words = ['Data Science Engineer', 'Full-Stack Developer', 'C++ & DSA Problem Solver', 'IoT Builder'];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      typing.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
      if (!deleting && ci > word.length) { deleting = true; setTimeout(tick, 1200); return; }
      if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
      setTimeout(tick, deleting ? 48 : 78);
    };
    tick();
  }

  // Scroll progress + active nav
  const progress = $('#scrollProgress');
  const sections = $$('section[id]');
  const navLinks = $$('a[href^="#"]');
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 160) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', updateScroll, {passive:true}); updateScroll();

  // Reveal on scroll
  const reveal = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); reveal.unobserve(e.target); }
  }), {threshold:.12});
  $$('.reveal').forEach(el => reveal.observe(el));

  // Project filtering
  const cards = $$('.project-card, .project-feature');
  const filterButtons = $$('.project-filter');
  const search = $('#projectSearch');
  const applyFilters = () => {
    const active = $('.project-filter.active')?.dataset.filter || 'all';
    const query = (search?.value || '').toLowerCase().trim();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const data = `${card.dataset.category || ''} ${text}`;
      const matchesCategory = active === 'all' || data.includes(active);
      const matchesSearch = !query || text.includes(query);
      card.classList.toggle('project-hidden', !(matchesCategory && matchesSearch));
    });
  };
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); applyFilters();
  }));
  search?.addEventListener('input', applyFilters);

  // Back to top
  const top = $('#backToTop');
  addEventListener('scroll', () => top?.classList.toggle('show', scrollY > 650), {passive:true});
  top?.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

  // Command palette
  const palette = $('#commandPalette'), input = $('#commandInput'), results = $('#commandResults');
  const items = sections.map(s => ({id:s.id, label:s.querySelector('h1,h2,h3')?.textContent?.trim() || s.id}));
  const render = q => {
    const filtered = items.filter(x => `${x.label} ${x.id}`.toLowerCase().includes(q.toLowerCase()));
    if (results) results.innerHTML = filtered.map(x => `<button data-target="${x.id}">${x.label}</button>`).join('');
  };
  const openPalette = () => { palette?.showModal(); render(''); setTimeout(()=>input?.focus(),50); };
  const closePalette = () => palette?.close();
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape') closePalette();
  });
  $('#commandClose')?.addEventListener('click', closePalette);
  input?.addEventListener('input', e => render(e.target.value));
  results?.addEventListener('click', e => {
    const b = e.target.closest('button[data-target]');
    if (!b) return;
    closePalette(); document.getElementById(b.dataset.target)?.scrollIntoView({behavior:'smooth'});
  });

  // Toast helper for contact buttons / future integrations.
  window.showPortfolioToast = msg => {
    const toast = $('#toast'); if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(()=>toast.classList.remove('show'), 3000);
  };

  // Subtle pointer glow on desktop
  const glow = $('#cursorGlow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      glow.style.transform = `translate3d(${e.clientX - 120}px, ${e.clientY - 120}px, 0)`;
    }, {passive:true});
  }
})();
