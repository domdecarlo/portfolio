# decarlo.design — portfolio site

Portfolio site for design work - HTML, CSS, and vanilla JavaScript.

## Files
- `index.html`   — home (Scraps feed + Projects grid)
- `project.html` — project detail page (reads `?id=` from the URL)
- `scraps.html`  — full-width Are.na feed
- `about.html`   — Info page
- `data.js`      — ALL content + config (edit this to change the site)
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
Almost everything lives in `data.js`: nav, Info page, the Are.na channel,
lightbox colors, and every project. Each project supports:
- `content` blocks (text, image rows with grid 1/2/3, `ratio`, `embed`, `heading`)
- a `sidebar` (title, text, labels, headings, credits, images/video)
- `private: true` to show a locked placeholder instead of the real work

See the comments at the top of `data.js` for the full reference.

## Requirements
Just a modern browser. The Are.na feed and any video embeds need an internet
connection; everything else works offline.
