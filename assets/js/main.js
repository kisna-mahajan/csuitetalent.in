// Nav scroll shadow
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

// Forms: one submission per click (the button re-enables if the visitor comes back with Back)
document.querySelectorAll('form.form').forEach(form => {
  form.addEventListener('submit', () => {
    const button = form.querySelector('[type="submit"]');
    if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  });
});
window.addEventListener('pageshow', () => {
  document.querySelectorAll('form.form [type="submit"][disabled]').forEach(b => { b.disabled = false; b.removeAttribute('aria-busy'); });
});

// Press scans and article images: tap/click to view full size (small on phones, often unreadable)
(() => {
  const images = [...document.querySelectorAll('main img')].filter(img => !img.closest('a, button, .profile-card__avatar'));
  if (!images.length || typeof HTMLDialogElement !== 'function') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = '<button type="button" class="lightbox__close" aria-label="Close">&times;</button><img class="lightbox__img" alt="">';
  document.body.appendChild(dialog);
  const big = dialog.querySelector('.lightbox__img');
  let opener = null;

  images.forEach(img => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zoom';
    button.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || ''));
    img.parentNode.insertBefore(button, img);
    button.appendChild(img);
    button.addEventListener('click', () => {
      opener = button;
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      dialog.classList.remove('is-zoomed');
      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
      dialog.scrollTop = 0;
    });
  });

  // Tap the enlarged image to toggle between fit-to-screen and full resolution (pan by scrolling)
  big.addEventListener('click', () => dialog.classList.toggle('is-zoomed'));
  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    if (opener) opener.focus();
  });
})();

// Back-to-top control on long pages, shown once the visitor is two screens down
(() => {
  const main = document.getElementById('main');
  if (!main || document.documentElement.scrollHeight < window.innerHeight * 4) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(button);
  const update = () => button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 2);
  window.addEventListener('scroll', update, { passive: true });
  update();
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    main.focus({ preventScroll: true });
  });
})();

// Hub cards (JOBNET, media): the whole card opens the article; identical "Read" links name their article
document.querySelectorAll('.archive-item').forEach((item, i) => {
  const link = item.querySelector('.archive-item__link');
  const title = item.querySelector('.archive-item__title');
  if (!link || !title) return;
  title.id = title.id || `archive-title-${i + 1}`;
  link.setAttribute('aria-describedby', title.id);
  item.classList.add('archive-item--linked');
});

// Gentle reveal on scroll, skipped when the visitor prefers reduced motion
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
