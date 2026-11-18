/* ============================================================
   PROJECT TEMPLATE + FIELD REFERENCE
   Not loaded by the site — this file is just for reading and copying.

   To add a project:
     1. copy the block at the bottom into projects/<id>.js
     2. add "<id>" to PROJECT_FILES in data.js (that list is the grid order)

   Each project is a grid tile on the home page and a page at /work/<id>.
   That page is generated from this file, and pushing rebuilds it automatically
   (.github/workflows/prerender.yml), so adding a project here is enough.
   Run `node build-seo.mjs` yourself only to preview the change locally.

   Core fields:
     id      unique, lowercase, no spaces
     title   project name
     year    shown on the grid tile
     tags    disciplines, shown on the grid tile
     cover   grid-tile image (fallback when `images` is empty)
     images  grid-tile carousel media (img or video)

   SEO / LINK PREVIEWS — what goes in the <head> of /work/<id>: the Google
   result, and the card Slack, iMessage, LinkedIn and X unfurl when the link
   gets shared.
     seoDescription  optional, ~155 characters of plain text. Without it the
                     first `text` in `sidebar` is used — tags stripped, cut to
                     length on a word boundary. Set this whenever that opening
                     paragraph doesn't stand on its own out of context.
   Derived, not settable here:
     the title is always "<SITE.name> — <title>";
     the preview image is `cover`, or the first usable entry in `images` if
     `cover` is missing from disk, or assets/img/info/head-knot.png;
     the URL comes from `id` — renaming it breaks links already shared.

   MAIN COLUMN — `content`: a flat list of blocks, rendered in order.
     content: [
       { text: "Paragraph. Links <a href='#'>allowed</a>." },  // or a bare string
       { images: ["a.jpg"] },                  // 1 → full width
       { images: ["b.jpg", "c.jpg"] },         // 2 → 2-up grid
       { images: ["d.jpg","e.jpg","f.jpg"] },  // 3 → 3-up grid
       { images: ["g.jpg","h.jpg"], grid: 1 }, // force columns with grid (1|2|3)
       { images: ["wide.jpg"], ratio: "16/9" },// crop box for the images (e.g. 16/9, 3/2, 1/1)
       { embed: "https://youtu.be/VIDEO_ID" }, // outside video (YouTube/Vimeo)
     ]
   grid defaults to the image count (1→full, 2→2-up, 3+→3-up). Images and videos
   (.mp4/.webm/.mov) both work — videos autoplay, loop and stay muted like a GIF
   (prefer .mp4 over .gif: far smaller); images open in the lightbox. `embed` takes a
   YouTube/Vimeo (or direct embed) URL and renders a responsive 16:9 player.

   SIDEBAR — `sidebar`: the left "info" panel, rendered top-to-bottom in order.
   Entry types:
     { title: "…" }                    bold title line
     { text: "…" }                     paragraph (HTML/links allowed)
     { label: "Year", value: "2018" }  labelled fact row
     { heading: "…" }                  small subheading
     { role: "…", name: "…", href? }   credit line (name can link)
     { image: "url", caption? }        image (an .mp4 here plays as video)
     { video: "clip.mp4", caption?, controls? }  loops muted; controls:true for a bar
     { embed: "https://youtu.be/ID", caption? }  outside video (YouTube/Vimeo),
                                                  responsive 16:9 player

   Hiding / gating:
     hidden: true   kept off the grid (still reachable by direct URL)
     private: true  shows on the grid, but the page's right column is a blurred,
                    dark-gradient placeholder ("Password protected work: Contact
                    to view.", override with privateMessage). Left info column
                    still renders. Don't load the real images until public.

   Per-project lightbox overrides: lightboxBg, lightboxCaption.

   (Legacy, still supported: `body` [paragraphs] and `sections` [heading+text+
   images blocks] — both superseded by `content`.)
   ============================================================ */

/* ---------- copy from here ----------
project({ // Project Name
  id: "project-id",                 // unique, lowercase, no spaces
  title: "Project Title",
  year: "2025",
  tags: "DISCIPLINE, DISCIPLINE",   // shown on the home grid tile
  cover: "assets/img/project/cover.jpg",
  images: ["assets/img/project/cover.jpg"],  // grid-tile carousel

  // SIDEBAR — default structure (renders top-to-bottom exactly as listed).
  sidebar: [
    { title: "Project Title" },
    { text: "One-line description of the project." },
    { label: "Year", value: "2025" },
    { label: "Discipline", value: "Brand Identity, ..." },
    { heading: "Section One" },
    { text: "Body copy for the first section." },
    { image: "assets/img/project/ref-2.jpg", caption: "Another reference." },

  ],

  // MAIN COLUMN — flat content blocks (text + image rows, grid 1|2|3)
  content: [
    { images: ["assets/img/project/01.jpg"] },
    { images: ["assets/img/project/02.jpg", "assets/img/project/03.jpg"] },
  ],
});
---------- to here ---------- */
