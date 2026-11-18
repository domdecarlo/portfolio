# decarlo.design — portfolio site

Portfolio site for design work - HTML, CSS, and vanilla JavaScript.

## Files
- `index.html`   — home (Scraps feed + Projects grid)
- `project.html` — project detail page (reads `?id=` from the URL)
- `scraps.html`  — full-width Are.na feed
- `about.html`   — Info page
- `data.js`      — site config: nav, Info page, Are.na, page <head> tags, project order
- `projects/`    — one file per project (`projects/_template.js` = field reference + copy-me block)
- `main.js`      — rendering + behavior
- `styles.css`   — all styling
- `assets/img/`  — images, video, logo

## Run it locally
The pages use `fetch()` (for the Are.na feed), which browsers block when a file
is opened directly with `file://`. So run a tiny local web server from this
folder instead:

Python (already on most machines):
    python3 -m http.server 8000

Node (if you prefer):
    npx serve .

Then open the address it prints, e.g. http://localhost:8000

Opening `index.html` by double-clicking mostly works, but the Scraps/Are.na
feed won't load and some links may misbehave — use the local server.

## Editing
Site-wide settings live in `data.js`: nav, Info page, the Are.na channel and
lightbox colors. Each project is its own file in `projects/` — to add one, copy
the block at the bottom of `projects/_template.js` into `projects/<id>.js` and
add `"<id>"` to `PROJECT_FILES` in `data.js` (that list is the grid order).
Each project supports:
- `content` blocks (text, image rows with grid 1/2/3, `ratio`, `embed`, `heading`)
- a `sidebar` (title, text, labels, headings, credits, images/video)
- `private: true` to show a locked placeholder instead of the real work

See `projects/_template.js` for the full reference.

Page titles, Google descriptions and link-preview cards live in `data.js` too:
projects get theirs from the project entry, and the top-level pages
(home, Info, Scraps, Scrap Designer) from `SITE.pages`. `build-seo.mjs` writes
them into the HTML — don't edit the block between `seo:start` and `seo:end`
in an .html file by hand; it gets overwritten on the next build.

## Requirements
Just a modern browser. The Are.na feed and any video embeds need an internet
connection; everything else works offline.
