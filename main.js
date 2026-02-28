/* ============================
   SEA Bloom Crystals — Main JS
   ============================ */

// === Custom Cursor ===
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (cursor && ring) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = document.querySelectorAll('a, button, .event-card, .event-mini, input, select, textarea, .vis-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.borderColor = 'rgba(200, 164, 106, 0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(200, 164, 106, 0.45)';
    });
  });
}

// === Nav scroll effect ===
const nav = document.getElementById('nav');
if (nav && !nav.classList.contains('nav-solid')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// === Mobile nav toggle ===
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

// === Scroll reveal ===
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings
        const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('visible');
        }, idx * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));
}

// === Newsletter form ===
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');
    const input = newsletterForm.querySelector('input');
    btn.textContent = '✦';
    btn.style.background = 'var(--sage)';
    input.value = '';
    input.placeholder = 'You\'re in! ✦';
  });
}
