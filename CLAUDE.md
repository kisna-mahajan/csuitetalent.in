# csuitetalent.in - GitHub Pages Website

## Project
Static website for CSuite Talent - C-suite and senior leadership hiring platform.
Hosted on GitHub Pages. Domain: csuitetalent.in via Cloudflare DNS.

## Stack
Pure HTML, CSS, vanilla JS only. No Node, no build tools, no frameworks.
GitHub Pages serves files directly from the main branch root.
Fonts: Inter (body) + Playfair Display (headings, incl. italic 600) from Google Fonts.
Forms post to formsubmit.co (no backend).

## Structure
/
├── CNAME                       ← must always contain: csuitetalent.in
├── index.html                  ← home
├── about/ philosophy/ contact/ corporate-partners/
├── gcc/ defence/ healthcare/ electronics/ steel/ cement/   ← 6 industry practice pages
├── publications/jobnet-archive/        ← JOBNET hub + 12 article pages (two article templates)
├── leadership/media-recognition/       ← media hub + 16 press-article pages
├── leadership/client-recognition/ leadership/research-citations/
├── media/financial-express-let-jobs-chase-people/   ← one press article outside the media folder
├── thank-you/                  ← form confirmation page (noindex), both forms redirect here
├── assets/css/style.css        ← the one shared stylesheet
├── assets/js/main.js           ← nav, menus, reveal, lightbox, back-to-top, form guard
├── assets/images/
├── sitemap.xml robots.txt llms.txt
└── pages/                      ← empty placeholder

## Rules
- All links must be relative (use ./assets/ not /assets/)
- Every HTML file must have charset UTF-8 and responsive viewport meta
- Never delete the CNAME file
- Never commit secrets or API keys
- Images under 300KB
- Do NOT add package.json, Node, or any build system
- Never use em dashes (— / &mdash;) or en dashes (– / &ndash;) anywhere in site text, titles, meta or structured data; use a plain hyphen "-" (owner preference, applied sitewide Oct 2026)
- No horizontal overflow on mobile: every change must be checked at 320, 360 and 390px wide
- Design/UX work must not change content (wording, headings, images) unless the owner asks

## Git
- Branch: main (auto-deploys to GitHub Pages)
- Commit format: feat: / fix: / style: / docs:
- One concern per commit

## Design
Professional B2B tone. Audience: C-suite executives and senior hiring managers.
Clean typography, generous whitespace, fast load times.

## Architecture
- **Nav + footer are copied into every page** (45 files). The nav markup is identical on all pages; change it with a script and keep it identical. Footers have 5 variants (the 14 media articles have a shorter footer).
- **Nav breakpoint is 960px** (not 768): `@media (min-width: 961px)` / `(max-width: 960px)` in style.css AND `matchMedia('(min-width: 961px)')` in main.js must stay in sync. Dropdown labels are `<button class="nav__dropdown-toggle" aria-controls="nav-industry|nav-publications">`; they never navigate. Desktop hover is mouse-only (pointerType) so touch tablets work by tap. The hamburger sits before `<ul id="nav-links">` in the markup (keyboard/screen-reader order).
- Current page/section highlighting is done in main.js (`aria-current`, `.is-current`) from `location.pathname` - no per-page markup.
- Every page: `<a class="skip-link" href="#main">`, exactly one `<main id="main" tabindex="-1">` between nav and footer, footer column headings are `<p class="footer__col-head">`.
- Logo is an image in nav and footer: `<picture>` with `main-logo.webp` + `main-logo.png` (666x169), shown 44px high; the footer logo sits on a white box. The text-logo CSS (`.nav__logo small` etc.) is hidden/unused.
- Google Fonts load asynchronously on every page: `<link rel="preload" ... as="style" onload="this.rel='stylesheet'">` plus a `<noscript>` stylesheet, URL includes Playfair italic 600. The home page also preloads `hero-bg.jpg`.
- Most inner pages also have a page-specific inline `<style>` block that loads AFTER style.css, so same-specificity inline rules win. Check the inline block before assuming a style.css change applies.
- **Template CSS lives in style.css, scoped by a body class**: `body.tpl-media-article` (17 press articles), `body.tpl-jobnet` (8 JOBNET articles, dark-hero template), `body.tpl-jobnet-alt` (4 JOBNET articles, breadcrumb-bar template). Those rules are written `:where(.tpl-x) selector` (zero added specificity) in blocks at the END of style.css, so they behave exactly like the inline blocks they replaced; whatever differs per page stays in that page's inline `<style>`. A new press/JOBNET article must carry the matching body class.
- Steel/cement components use `sector-*` classes (`sector-point`, `sector-roles`, `sector-steps`, `sector-section--light/--white`, `sector-note`, `sector-tagline`) defined at the end of style.css; only their hero background-image stays inline.
- **Search (Google) conventions**: every page is its own `index.html` URL with one `<h1>`, a unique title/description, and a canonical URL with trailing slash; `og:url` and JSON-LD `url` values use the same trailing-slash form; every indexable page is listed in sitemap.xml (update `lastmod` when pages change); noindex pages (thank-you) stay out of the sitemap. All navigation is plain `<a href>` in the HTML (menus too), so crawlers never need JS.
- Breakpoints: 1024 (tablet), 960 (nav), 768 (phone; sections get the 20px gutter via `--section-padding: 64px 20px` and `section .container` drops its own padding), 600, 480.
- Tokens in `:root`: `--color-muted #555`, `--color-accent #2251ff`, `--color-accent-on-dark #8da9ff` (use on dark backgrounds).
- Paragraphs use their containers' full width (owner prefers text spread out over a narrow reading column; a 62ch cap was tried and removed).
- Scroll reveal: main.js adds `.reveal` only if IntersectionObserver exists and reduced motion is not requested; content is never hidden without JS or when printing.
- Images inside `<main>` (except the About avatar) are wrapped by main.js in a `button.zoom` and open in a `<dialog class="lightbox">`; tapping the enlarged image toggles full resolution.
- Forms: contact `_next` = `https://csuitetalent.in/thank-you/`, corporate partners `_next` = `.../thank-you/?form=partner` (shows partner wording). Practice-page CTAs link `/contact/?vertical=<slug>` which pre-selects the industry. Inputs are 16px (prevents iOS zoom).
- Forms post to **formsubmit.co** (free; owner chose it over paid Formspree/Web3Forms, including after the Oct 2026 outage, because it includes attachments). From India it can take ~20s and sometimes returns Cloudflare 522. main.js therefore submits each form natively into a hidden iframe (`form.target`): when the iframe lands on our `/thank-you/` the parent navigates there; a cross-origin page in the iframe (FormSubmit error/522) or 60s without an answer shows `.form-fallback` (mailto/tel) and restores the button (`Sending...` while waiting). `data-timeout-ms` on a form overrides the 60s (tests). Contact form has an optional `attachment` file input (`enctype="multipart/form-data"`, `data-max-mb="10"`; FormSubmit caps a submission at 10 MB and emails the file). Neither formsubmit.co nor csuitetalent.in sends X-Frame-Options/CSP, which this relies on. Test form changes against a local stand-in, never by submitting the live form (that emails the owner).

## Build / deploy
- No build. Preview locally: `python -m http.server 8765 --bind 127.0.0.1` from the repo root (links are root-absolute, so it must be served from root, not opened as files). `.claude/launch.json` has this as "site".
- Deploy = push to `main` (GitHub Pages). Pushing publishes to the live site within about a minute (confirm by checking the live HTML for the new `style.css?v=`).

## Known issues
- Links are root-absolute (`/about/`) throughout, contrary to the "relative links" rule above. They work on GitHub Pages with the custom domain; converting would touch every page.
- All referenced images are under 300KB (hero-bg.jpg 208KB since Aug 2026; others re-encoded Oct 2026; scans keep full resolution for the zoom viewer). Re-encode recipe: Pillow, progressive JPEG, max 2400px wide for heroes, highest quality that fits 290KB.
- ~10MB of unreferenced images sit untracked in assets/images (`publications *.jpeg`, `rc *.JPG`, `cr 1.jpeg`, `Philosophy hero.jpg`, `hero-bg_old.jpg`, `Main Logo.png`).
- JOBNET articles still use two different templates (4 use the `.breadcrumb`/`.article-section` markup); about, corporate-partners, research, client-recognition, philosophy and the two hubs keep large page-specific inline `<style>` blocks (one page each, nothing to deduplicate).
- Media article pages reference assets with `../../../../` (climbs above root; works only because browsers clamp at root).

## Pending work (priority order)
1. Unify the two JOBNET article templates (markup change; then merge tpl-jobnet-alt into tpl-jobnet).
2. Optional custom 404.html (GitHub Pages serves its default 404 today); needs owner-approved wording.
3. Owner decisions from the Oct 2026 UX review (not done because they change structure/content): move the "Why" stats up on home; put JOBNET article text before the scans; breadcrumb "Home / About / JOBNET Archive" vs nav placement; "next article" link on the FE article and a slim cross-link row at the end of the four hubs; About 2000-timeline "Read More" points to the media hub rather than the FE article; tap-to-call in the mobile header.

## Decisions log
- Oct 2026: merged the August origin/main work (image logo, async fonts, SEO pass) with the UX overhaul; deployed 2026-10-21 and verified live (no JS errors, failed requests or 404s on any page, desktop + phone).
- Oct 2026 UX overhaul (3 independent reviewers: navigation, visual, audience/accessibility): sticky header fixed (overflow-x on both html and body had made body the scroll container), 960px nav, touch/keyboard menus, AA contrast, phone gutters, thank-you page, lightbox, back-to-top. Content deliberately untouched apart from the em-dash change the owner requested; "Skip to content" is the only added visible text (keyboard focus only), plus the thank-you page copy.
- Em dashes and then en dashes replaced with hyphens everywhere (owner request; the owner reads both as "big hyphens"). An unspaced dash between two words became " - ".
- Thank-you page instead of an in-page banner: the confirmation is the first thing on screen with no scrolling (owner request).
- Inline-CSS refactor (Oct 2026) was verified by snapshotting the computed style + geometry of every element on all 45 pages at 1440/820/390px before and after (must be identical within 0.3px), plus a pixel comparison. Moving a shared rule out of an inline block is only safe if no rule left on that page, earlier in source and on the same selector with overlapping properties, would start overriding it.

## Gotchas
- **Other sessions (Claude, Codex) push straight to main.** Always `git fetch origin` and check `git log main..origin/main` before pushing; if it moved, merge (never force-push). In Oct 2026 a whole day's work was built on a checkout missing 11 August commits and had to be merged before pushing.
- Never put `overflow-x` on both `html` and `body` - it breaks the sticky header. Only `html` has it.
- New pages must copy the current nav block exactly (with `id="nav-links"`, button toggles, skip link and `<main>`), or menus and highlighting break.
- `.section-label` is `display:block` and follows its parent's `text-align`; to centre a label, centre its container.
- Watermark numbers (`.step__number`, `.archive-item__num`, `.partner-step__number`) are intentionally faint decoration.
- formsubmit.co requires absolute `_next` URLs.
- The `:where(.tpl-*)` and `sector-*` blocks must stay at the END of style.css: they rely on coming after every base rule, as the inline blocks did.
- **Cache-busting:** every page loads `style.css?v=YYYYMMDD` and `main.js?v=YYYYMMDD`. Whenever style.css or main.js changes, bump the version on ALL pages in the same commit (one regex over `assets/(css/style\.css|js/main\.js)(\?v=[^"]*)?`). Otherwise visitors with the old file cached get new HTML with old CSS/JS (broken header, visible skip link) for up to the cache lifetime.
