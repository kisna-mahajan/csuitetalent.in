// Nav scroll shadow
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Breakpoint must match the 960px nav media queries in style.css
const desktopNav = window.matchMedia('(min-width: 961px)');
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
const dropdowns = [...document.querySelectorAll('.nav__dropdown')];

function setDropdown(dropdown, open) {
  dropdown.classList.toggle('is-open', open);
  if (!open) delete dropdown.dataset.hoverOpened;
  const toggle = dropdown.querySelector('.nav__dropdown-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', String(open));
}

function closeDropdowns(except) {
  dropdowns.forEach(d => { if (d !== except) setDropdown(d, false); });
}

// Mobile menu
function setMenu(open) {
  if (!hamburger || !navLinks) return;
  navLinks.classList.toggle('is-open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('nav-open', open);
  if (!open) closeDropdowns();
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));

  // Close the menu when a link is chosen
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Growing past the breakpoint (rotate, resize) resets the phone menu
  desktopNav.addEventListener('change', () => setMenu(false));
}

// Dropdown toggles open/close their menu; they never navigate
dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.nav__dropdown-toggle');
  if (!toggle) return;
  let closeTimer;

  toggle.addEventListener('click', () => {
    // A mouse user who hovered the menu open and then clicks the label keeps it open
    if (dropdown.dataset.hoverOpened) { delete dropdown.dataset.hoverOpened; return; }
    const open = !dropdown.classList.contains('is-open');
    closeDropdowns(dropdown);
    setDropdown(dropdown, open);
  });

  // Desktop hover: mouse only, so a tap on a touch tablet is handled by click alone
  dropdown.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'mouse' || !desktopNav.matches) return;
    clearTimeout(closeTimer);
    closeDropdowns(dropdown);
    if (!dropdown.classList.contains('is-open')) {
      setDropdown(dropdown, true);
      dropdown.dataset.hoverOpened = 'true';
    }
  });
  dropdown.addEventListener('pointerleave', e => {
    if (e.pointerType !== 'mouse' || !desktopNav.matches) return;
    closeTimer = setTimeout(() => setDropdown(dropdown, false), 300);
  });

  // Keyboard: closing when focus moves out of the menu
  dropdown.addEventListener('focusout', e => {
    if (desktopNav.matches && !dropdown.contains(e.relatedTarget)) setDropdown(dropdown, false);
  });
});

// Click/tap outside the nav closes any open menu
document.addEventListener('click', e => {
  if (e.target.closest('.nav')) return;
  closeDropdowns();
  setMenu(false);
});

// Escape closes the innermost open menu and returns focus to its control
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const open = dropdowns.find(d => d.classList.contains('is-open'));
  if (open) {
    setDropdown(open, false);
    open.querySelector('.nav__dropdown-toggle').focus();
  } else if (navLinks && navLinks.classList.contains('is-open')) {
    setMenu(false);
    hamburger.focus();
  }
});

// Show where the visitor is: current page link, and the section its dropdown belongs to
(() => {
  const path = window.location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav__links a[href]').forEach(a => {
    if (new URL(a.href, window.location.href).pathname === path) a.setAttribute('aria-current', 'page');
  });
  const sections = {
    'nav-industry': /^\/(gcc|defence|healthcare|electronics|steel|cement)\//,
    'nav-publications': /^\/(publications|leadership|media)\//,
  };
  Object.entries(sections).forEach(([id, re]) => {
    const toggle = document.querySelector(`.nav__dropdown-toggle[aria-controls="${id}"]`);
    if (toggle && re.test(path)) toggle.classList.add('is-current');
  });
})();

// Gentle reveal on scroll, skipped when the visitor prefers reduced motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
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
    el.classList.add('reveal');
    observer.observe(el);
  });
}
