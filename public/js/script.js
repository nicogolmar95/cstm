document.addEventListener('DOMContentLoaded', () => {

  // ============ THEME SWITCHER ============
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('cstm-theme') || 'techdark';
  document.body.setAttribute('data-theme', savedTheme);
  themeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === savedTheme));
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('cstm-theme', theme);
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ============ NAVBAR SCROLL ============
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ============ MOBILE NAV ============
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ TYPING EFFECT ============
  const phrases = ['impulsa tu negocio', 'escala sin limites', 'automatiza procesos', 'genera impacto'];
  const typedEl = document.getElementById('typedText');
  let pi = 0, ci = 0, deleting = false, pauseCount = 0;

  function typeStep() {
    const current = phrases[pi];
    if (!deleting) {
      typedEl.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        if (pauseCount < 25) { pauseCount++; setTimeout(typeStep, 100); return; }
        pauseCount = 0;
        deleting = true;
        setTimeout(typeStep, 40);
        return;
      }
      setTimeout(typeStep, 70 + Math.random() * 40);
    } else {
      typedEl.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(typeStep, 300);
        return;
      }
      setTimeout(typeStep, 30);
    }
  }
  setTimeout(typeStep, 600);

  // ============ SCROLL REVEAL ============
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 5 * 0.08, 0.32)}s`;
    observer.observe(el);
  });

  // ============ FORM ============
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const btn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        msg.className = 'form-message success';
        msg.textContent = 'Mensaje enviado. Te responderemos pronto.';
        form.reset();
        showToast('Mensaje enviado correctamente');
      } else {
        msg.className = 'form-message error';
        msg.textContent = result.error || 'Error al enviar. Intenta de nuevo.';
      }
    } catch {
      msg.className = 'form-message error';
      msg.textContent = 'Error de conexion. Intenta de nuevo.';
    }
    btn.disabled = false;
    btn.innerHTML = 'Enviar mensaje <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
  });

  // ============ TOAST ============
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ============ ACTIVE NAV LINKS ============
  const sections = document.querySelectorAll('section[id]');
  const navA = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.getAttribute('id');
    });
    navA.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? '#e2e8f0' : '';
    });
  }, { passive: true });

  // ============ ANIMATED COUNTERS ============
  const counters = document.querySelectorAll('.proof-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)([%+]*)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = match[2] || '';
          let current = 0;
          const duration = 1500;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, 16);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ============ TILT CARDS ============
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .1s ease-out';
      });
    });
  }

  // ============ PARALLAX SHAPES ============
  const pShapes = document.querySelectorAll('.p-shape');
  function updateParallax() {
    const scrollY = window.scrollY;
    pShapes.forEach(shape => {
      const speed = parseFloat(shape.dataset.speed) || 0.3;
      const rect = shape.parentElement.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        const yOffset = (scrollY - shape.parentElement.offsetTop) * speed * 0.15;
        shape.style.transform = `translateY(${yOffset}px)`;
      }
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ============ ORBS PARALLAX ============
  const orbs = document.querySelectorAll('.orb');
  function updateOrbs() {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.02 + i * 0.01;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
  window.addEventListener('scroll', updateOrbs, { passive: true });

});