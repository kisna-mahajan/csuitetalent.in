# csuitetalent.in — GitHub Pages Website

## Project
Static website for CSuite Talent — C-suite and senior leadership hiring platform.
Hosted on GitHub Pages. Domain: csuitetalent.in via Cloudflare DNS.

## Stack
Pure HTML, CSS, vanilla JS only. No Node, no build tools, no frameworks.
GitHub Pages serves files directly from the main branch root.

## Structure
/
├── CNAME              ← must always contain: csuitetalent.in
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── pages/

## Rules
- All links must be relative (use ./assets/ not /assets/)
- Every HTML file must have charset UTF-8 and responsive viewport meta
- Never delete the CNAME file
- Never commit secrets or API keys
- Images under 300KB
- Do NOT add package.json, Node, or any build system

## Git
- Branch: main (auto-deploys to GitHub Pages)
- Commit format: feat: / fix: / style: / docs:
- One concern per commit

## Design
Professional B2B tone. Audience: C-suite executives and senior hiring managers.
Clean typography, generous whitespace, fast load times.
