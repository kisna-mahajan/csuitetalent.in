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
- Never use em dashes (— or &mdash;) anywhere in site text, titles or meta; use a hyphen "-" (owner preference, applied sitewide Oct 2026)
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
- Every page: `<a class="skip-link" href="#main">`, `<main id="main" tabindex="-1">` between nav and footer, footer column headings are `<h2>`.
- Most inner pages also have a page-specific inline `<style>` block that loads AFTER style.css, so same-specificity inline rules win. Check the inline block before assuming a style.css change applies.
- Breakpoints: 1024 (tablet), 960 (nav), 768 (phone; sections get the 20px gutter via `--section-padding: 64px 20px` and `section .container` drops its own padding), 600, 480.
- Tokens in `:root`: `--color-muted #555`, `--color-accent #2251ff`, `--color-accent-on-dark #8da9ff` (use on dark backgrounds), `--measure 62ch` (long-form line length).
- Scroll reveal: main.js adds `.reveal` only if IntersectionObserver exists and reduced motion is not requested; content is never hidden without JS or when printing.
- Images inside `<main>` (except the About avatar) are wrapped by main.js in a `button.zoom` and open in a `<dialog class="lightbox">`; tapping the enlarged image toggles full resolution.
- Forms: contact `_next` = `https://csuitetalent.in/thank-you/`, corporate partners `_next` = `.../thank-you/?form=partner` (shows partner wording). Practice-page CTAs link `/contact/?vertical=<slug>` which pre-selects the industry. Inputs are 16px (prevents iOS zoom).

## Build / deploy
- No build. Preview locally: `python -m http.server 8765 --bind 127.0.0.1` from the repo root (links are root-absolute, so it must be served from root, not opened as files). `.claude/launch.json` has this as "site".
- Deploy = push to `main` (GitHub Pages). Pushing publishes to the live site immediately.

## Known issues
- Links are root-absolute (`/about/`) throughout, contrary to the "relative links" rule above. They work on GitHub Pages with the custom domain; converting would touch every page.
- Images over the 300KB rule: `hero-bg.jpg` (~2.5MB, 5184px), `research-hero.jpg` (~3.7MB), `philosophy-hero.jpg`, `leader-bg.jpg`, `AM.jpg` (1024px shown at 120px). Needs re-export.
- ~10MB of unreferenced images sit untracked in assets/images (`publications *.jpeg`, `rc *.JPG`, `cr 1.jpeg`, `Philosophy hero.jpg`, `hero-bg_old.jpg`, `Main Logo.png`).
- steel/ and cement/ carry ~200 inline `style=""` attributes each; JOBNET articles use two different templates (4 use the `.breadcrumb`/`.article-section` template).
- Media article pages reference assets with `../../../../` (climbs above root; works only because browsers clamp at root).

## Pending work (priority order)
1. Re-export oversized images (above) to <300KB; consider a 1200px phone hero.
2. Move duplicated inline styles (steel/cement, article templates, form CSS) into style.css; unify the two JOBNET article templates.
3. Owner decisions from the Oct 2026 UX review (not done because they change structure/content): move the "Why" stats up on home; put JOBNET article text before the scans; breadcrumb "Home / About / JOBNET Archive" vs nav placement; "next article" link on the FE article and a slim cross-link row at the end of the four hubs; About 2000-timeline "Read More" points to the media hub rather than the FE article; tap-to-call in the mobile header.

## Decisions log
- Oct 2026 UX overhaul (3 independent reviewers: navigation, visual, audience/accessibility): sticky header fixed (overflow-x on both html and body had made body the scroll container), 960px nav, touch/keyboard menus, AA contrast, phone gutters, thank-you page, lightbox, back-to-top. Content deliberately untouched apart from the em-dash change the owner requested; "Skip to content" is the only added visible text (keyboard focus only), plus the thank-you page copy.
- Em dashes replaced with hyphens everywhere (owner request). Unspaced "a-b" became "a - b".
- Thank-you page instead of an in-page banner: the confirmation is the first thing on screen with no scrolling (owner request).

## Gotchas
- Never put `overflow-x` on both `html` and `body` - it breaks the sticky header. Only `html` has it.
- New pages must copy the current nav block exactly (with `id="nav-links"`, button toggles, skip link and `<main>`), or menus and highlighting break.
- `.section-label` is `display:block` and follows its parent's `text-align`; to centre a label, centre its container.
- Watermark numbers (`.step__number`, `.archive-item__num`, `.partner-step__number`) are intentionally faint decoration.
- formsubmit.co requires absolute `_next` URLs.
