# Clarity Health Clinic

Multi-page website for a primary healthcare clinic in Claremont, Cape Town.
Student: Dulce Da Silva | ST10531158 | WEDE5020 POE (Part 3)

**Live site:** https://clarity-health-clinic.netlify.app
**Repository:** https://github.com/YOUR-USERNAME/YOUR-REPO

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home: hero, services, health tips (dynamic), gallery with lightbox |
| `about.html` | Who we are |
| `service.html` | Dynamic services list with search, category filter and sorting |
| `enquiry.html` | Login + enquiry form (services, volunteering, sponsorship) |
| `contact.html` | General contact form compiled into an email |

## Part 3 features

### JavaScript and interactivity
- CSS and JS animations: fade-up reveal on scroll, button ripple, hero parallax, SVG underline.
- Advanced DOM manipulation: elements created with `createElement`, organisation fields toggled, results rendered dynamically.
- Dynamic content: services and health tips are loaded by JavaScript (`script.js`).
- Search, filter and sort on the services page.
- Gallery with lightbox (keyboard: Esc, left and right arrows).

### SEO
- On-page: unique `<title>` and meta description per page, keywords, one `<h1>` per page with `h2`/`h3` hierarchy, descriptive image file names and alt text, clean URLs, internal linking, mobile-friendly responsive layout.
- Off-page: social media links and Open Graph tags, local SEO via `MedicalClinic` JSON-LD (Claremont, Cape Town).
- `robots.txt` and `sitemap.xml` included.
- Page speed: lazy-loaded images with width/height, `defer` scripts, preconnect, long-term caching via `_headers`.
- Security: `_headers` (X-Frame-Options, nosniff, HSTS, Referrer-Policy), `rel="noopener noreferrer"` on external links, no `innerHTML` with user input.

### Forms
- **enquiry.html**: HTML5 attributes + JavaScript validation (email, SA phone number, date, min and max length), inline error messages, AJAX submission with `fetch`, and a processed response showing cost and availability (or volunteering and sponsorship info for NPOs).
- **contact.html**: validated form that compiles the data into an email (`mailto:`) addressed to the clinic; the visitor reviews and sends it.

## Setup notes
1. Replace `YOUR_FORM_ID` in the enquiry form `action` with a real Formspree form ID.
2. The clinic email is set in `script.js` (`CLINIC_EMAIL`) and in the contact form `action`.

## Deployment
Deployed on Netlify from the `main` branch (Add new site > Import from Git).

## Changelog
See the Changelog in the POE document. Summary of Part 3:
- Added `script.js` (animations, dynamic content, search/sort, lightbox, validation, AJAX).
- Added `extra.css`, `robots.txt`, `sitemap.xml`, `_headers`.
- Rebuilt `enquiry.html` and `contact.html` with validated forms.
- Added SEO meta tags, Open Graph and JSON-LD to every page.
- Fixed the image path and moved the script tag inside `<body>`.

## References
- MDN Web Docs. HTML forms, Constraint validation, Fetch API, IntersectionObserver.
- Google Search Central. SEO starter guide, robots.txt and sitemap documentation.
- Schema.org. MedicalClinic.
- Unsplash. Photography used under the Unsplash licence.