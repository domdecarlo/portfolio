# decarlo.design — portfolio site

Portfolio site for design work - HTML, CSS, and vanilla JavaScript.

## Layout
```
content/              ← what you edit
  site.js               nav, Info page, Are.na, page <head> tags, project order
  projects/<id>.js      one file per project
  projects/_template.js field reference + a block to copy for new projects
assets/
  css/styles.css        all styling
  js/main.js            rendering + behaviour
  img/                  images, video, logo
work/                 ← generated from content/ — don't edit by hand
scripts/
  build-seo.mjs         writes work/ and the <head> tags of the pages below
  build-favicon.sh      rebuilds the favicons from the logo
_lab/                 experiments; never published (GitHub Pages skips _folders)

index.html            home: Scraps feed + Projects grid      → /
info.html             Info page                              → /info
scraps.html           full Are.na feed                       → /scraps
scrap-designer.html   the scrap board on its own             → /scrap-designer
project.html          legacy ?id= project links              → /project.html?id=…
about.html            redirect stub for the old /about URL
CNAME, favicon.*, apple-touch-icon.png   must stay at the root
```
The `.html` pages live at the root because their location is their URL.

## Run it locally
The pages use `fetch()` (for the Are.na feed), which browsers block when a file
is opened directly with `file://`. So run a tiny local web server from this
folder instead:

    npm run serve          # = python3 -m http.server 8000

To regenerate `work/` and the page `<head>` tags after editing `content/`
(pushing does this for you, so it's only needed to preview locally):

    npm run build

Then open the address it prints, e.g. http://localhost:8000

Opening `index.html` by double-clicking mostly works, but the Scraps/Are.na
feed won't load and some links may misbehave — use the local server.

## Editing
Site-wide settings live in `content/site.js`: nav, Info page, the Are.na channel
and lightbox colors. Each project is its own file in `content/projects/` — to add
one, copy the block at the bottom of `content/projects/_template.js` into
`content/projects/<id>.js` and add `"<id>"` to `PROJECT_FILES` in
`content/site.js` (that list is the grid order).
Each project supports:
- `content` blocks (text, image rows with grid 1/2/3, `ratio`, `embed`, `heading`)
- a `sidebar` (title, text, labels, headings, credits, images/video)
- `private: true` to show a locked placeholder instead of the real work

See `content/projects/_template.js` for the full reference.

Page titles, Google descriptions and link-preview cards live in `content/` too:
projects get theirs from the project entry, and the top-level pages
(home, Info, Scraps, Scrap Designer) from `SITE.pages`. `scripts/build-seo.mjs` writes
them into the HTML — don't edit the block between `seo:start` and `seo:end`
in an .html file by hand; it gets overwritten on the next build.
