/* ===========================
   ELITE DRAPE — Main JS
   =========================== */

// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

if (cursor && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor scale on hover
  document.querySelectorAll('a, button, .product-card, .category-card, .filter-btn, .hamburger').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.2)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorRing.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.opacity = '0.7';
    });
  });
}

// ── Loader ──
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 2000);
});

// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── Mobile Menu ──
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Scroll Reveal ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => observer.observe(el));
}
initReveal();

// ── Active Nav Link ──
(function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Page Transition ──
function setupPageTransition() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const transition = document.querySelector('.page-transition') || createTransition();
      transition.classList.add('enter');
      setTimeout(() => {
        window.location.href = href;
      }, 480);
    });
  });
}

function createTransition() {
  const div = document.createElement('div');
  div.classList.add('page-transition');
  document.body.appendChild(div);
  return div;
}

// On page load – exit animation
window.addEventListener('pageshow', () => {
  const transition = document.querySelector('.page-transition');
  if (transition) {
    transition.classList.remove('enter');
    transition.classList.add('exit');
    setTimeout(() => transition.classList.remove('exit'), 500);
  }
});

setupPageTransition();

// ── Filter Buttons ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.filter-bar');
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.filter;
    const cards = document.querySelectorAll('.product-card[data-category]');
    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Parallax on hero bg ──
const heroBgs = document.querySelectorAll('.hero-bg, .page-hero-bg');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBgs.forEach(bg => {
    bg.style.transform = `scale(1.06) translateY(${scrollY * 0.25}px)`;
  });
});

// ── Number counter animation ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));
