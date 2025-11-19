# General Arcade — Hugo + GitHub Pages

Static site with auto-deployment to GitHub Pages. Visual design and assets copied from the provided `_files` archive.
To replicate the layout 1:1, insert the current site's HTML markup into Hugo templates:

- `layouts/partials/header.html` — header
- `layouts/index.html` — homepage
- `layouts/_default/single.html` — page/article
- `layouts/_default/list.html` — article/news list
- `layouts/partials/footer.html` — footer

Assets (CSS/JS/images/fonts) are already in `static/` under their respective paths. Main CSS/JS are included in `baseof.html`.
If needed, adjust paths to style/script files to match your actual `main.css`/`main.js`.

## Local Development
```bash
hugo server -D
```
Open http://localhost:1313

## Deployment
- Push to the `main` branch. CI will build and deploy to GitHub Pages.

## Security
- CSP/Referrer-Policy/X-Frame-Options/Permissions-Policy are set via `<meta http-equiv>` in `baseof.html` (for GitHub Pages).
- Do not use inline scripts or third-party CDN scripts. All assets should be served from your domain.

## Content (Markdown)
- Pages and articles — in `content/`. Example post: `content/blog/2025-11-03-sample.md`.
