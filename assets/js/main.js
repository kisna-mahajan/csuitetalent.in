// Nav scroll shadow
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Mobile nav toggle
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    const expanded = navLinks.classList.contains('is-open');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  // Close nav when a non-dropdown link is clicked
  navLinks.querySelectorAll('a:not(.nav__dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });
}

// Dropdown toggle (click, for mobile and accessibility)
document.querySelectorAll('.nav__dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', e => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation(); // prevent outside-click handler from immediately closing
      const parent = toggle.closest('.nav__dropdown');
      const wasOpen = parent.classList.contains('is-open');
      // Close all others first
      document.querySelectorAll('.nav__dropdown.is-open').forEach(d => d.classList.remove('is-open'));
      if (!wasOpen) parent.classList.add('is-open');
      toggle.setAttribute('aria-expanded', String(!wasOpen));
    }
  });
});

// Close dropdowns when clicking outside (but not when tapping a toggle — that uses stopPropagation)
document.addEventListener('click', e => {
  if (!e.target.closest('.nav__dropdown')) {
    document.querySelectorAll('.nav__dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  }
});

// Smooth reveal on scroll
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.service-card, .step, .stat, .practice-card, .why-brief__point').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(el);
});

// Add visible class styles via JS (avoids FOUC without extra CSS)
const style = document.createElement('style');
style.textContent = '.is-visible { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);
