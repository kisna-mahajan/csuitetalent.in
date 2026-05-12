// Mobile nav toggle
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    const expanded = navLinks.classList.contains('is-open');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('is-open'));
  });
}

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

document.querySelectorAll('.service-card, .step, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  observer.observe(el);
});

document.addEventListener('animationframe', () => {}, { passive: true });

// Add visible class styles via JS (avoids FOUC without extra CSS)
const style = document.createElement('style');
style.textContent = '.is-visible { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);
