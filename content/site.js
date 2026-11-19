/* ============================================================
   SITE CONFIG
   Header/nav, Info page, Are.na feed, lightbox and page <head> tags live here.
   Each project lives in its own file in content/projects/ — the field
   reference and a copy-me template are in content/projects/_template.js.
   ============================================================ */

const SITE = {
  name: "Dominic DeCarlo",
  // Drop a logo file in the folder and set logo: "logo.svg", or leave "" for the ◎ placeholder.
  logo: "assets/img/vector/vector-head.svg",

  // ---- CENTER ZONE of the top bar ----
  // A flexible middle area for extra info + secondary links (kept empty by
  // default — add text/links here anytime and they appear between the
  // wordmark and the nav).
  centerInfo: "",
  centerLinks: [],

  // ---- DESCRIPTION BAND (below the header) ----
  // intro renders on the left, contactLinks on the right.
  // HTML is allowed in `intro` (e.g. <strong> for your name).
  intro:
    "",
  contactLinks: [
    //{ label: "Email", href: "mailto:hello@decarlo.design" },
    //{ label: "LinkedIn", href: "#" },
    //{ label: "Instagram", href: "#" },
  ],

  // ---- MAIN NAV (right side of top bar) ----
  // A nav item can be a plain link, or a dropdown by giving it a `children`
  // array of { label, href } (external http links open in a new tab).
  nav: [
    //{ label: "Work", href: "/" },
    { label: "INFO", href: "/info" },
    {
      label: "MORE",
      children: [
        { label: "Scrap", href: "/scraps" },
        { label: "Archive", href: "https://dominicdecarlo.com" },
      ],
    },
    //{ label: "Shop", href: "#" },
  ],

  // ---- INFO PAGE ----
  // Left column: photo + bio + contact links. Right column stays blank for now
  // (reserved for an interactive image collection later).
  info: {
    photo: "assets/img/info/head-knot.png",
    bio: [
      "Hi, I'm Dominic De Carlo, a Visual Designer & Illustrator based in San Francisco.",
      "Focused on creating cohesive brand experiences with my MFA brain.",
    ],
    links: [
      { label: "Email", href: "mailto:dddecarlo@gmail.com" },
      { label: "Instagram", href: "https://www.instagram.com/domdecarlo/" },
      { label: "Are.na", href: "https://www.are.na/dominic-decarlo" },
    ],
  },

  // ---- Scrap FEED (left column) ----
  // Put your Are.na channel slug here (the bit after are.na/username/).
  // e.g. for https://www.are.na/dominic/scraps  the slug is "scraps"
  arena: {
    channelSlug: "scrap-k6m8xpubrkg", // are.na/dominic-decarlo/scrap-k6m8xpubrkg
    perPage: 24, // blocks fetched per scroll batch
  },

  // ---- INFO CANVAS (right column of the Info page + the landing stage) ----
  // The scrap board: an interactive image board that pulls the newest scraps
  // from the Are.na channel above. Three modes, switchable with the on-canvas
  // toggle (each page remembers its own choice):
  //   "trail"  — images reveal along the cursor's path and fade as new ones
  //              arrive; anything you grab becomes a permanent keeper.
  //   "board"  — the original: click / Space / auto-drop into random spots.
  //   "wheel"  — a turning ring of images on a dark stage that streams fresh
  //              scraps as it spins; hover pops one forward, clicking opens it
  //              full-screen, and sliders on the canvas shape the ring.
  // In trail and board every image is a draggable / resizable / rotatable /
  // closeable window, the whole board can be tidied into a grid or scattered at
  // random, and scraps are placed by clicking the canvas (or Space) — there's no
  // add button. Wheel mode replaces the windows with the ring.
  infoCanvas: {
    enabled: true,
    channelSlug: "scrap-k6m8xpubrkg", // defaults to arena.channelSlug if omitted
    mode: "trail",       // starting mode on desktop: "trail", "board" or "wheel"
    mobileMode: "board", // starting mode on mobile/touch (trail needs a cursor)
    modeByPage: {        // per-page override of `mode`, keyed by data-page
      "info.html": "board", // the Info page opens as a board
    },
    showToggle: true,    // show the on-canvas Trail/Board/Wheel switch
    showActions: true,   // show the Tidy / Scatter / Clear button bar
                         // keys: space add · t switch · g tidy · s scatter · c clear

    guaranteedNew: 15,   // reveal the newest N scraps first (in shuffled order)

    // trail mode
    trailDistance: 90,   // px of cursor travel between reveals (smaller = denser)
    trailMax: 22,        // max ambient (untouched) images before the oldest fades

    // board mode
    initialDelay: 2500,  // ms before the board starts auto-dropping
    autoInterval: 2200,  // ms between auto-dropped images (0 = click/Space only)
    maxAuto: 0,          // stop auto after N images (0 = until the pool runs out)

    // wheel mode (starting values — the on-canvas sliders move all of these)
    deckCount: 40,       // images riding the ring
    deckSpeed: 0.25,     // rotation speed in radians/sec (0 = parked)
    deckTile: 200,       // px — image size on the ring
    deckTilt: -0.6,      // ring tilt in radians (negative = rises to the right)
    deckFlat: 0.34,      // ellipse flatness, height ÷ width (lower = more edge-on)

    defaultWidth: 250,   // px — window width for a normal (portrait/square) image
    wideWidth: 420,      // px — window width for a wide image (aspect > 1.3)
    hint: "",            // helper line ("" = auto, mode-appropriate text)
  },

  // ---- LIGHTBOX ----
  // Defaults for the zoomed image view on project pages.
  // Override per project by adding `lightboxBg: "..."` and/or
  // `lightboxCaption: "..."` to that project object.
  lightbox: {
    bg: "rgb(191, 132, 72)",   // background behind the image
    caption: "#1a1a1a",         // alt-text caption color
  },

  // ---- PAGE <head> TAGS ----
  // Title, Google description and link-preview card for each top-level page.
  // scripts/build-seo.mjs writes these into the file's <head> (between the
  // seo:start / seo:end comments) — edit here, not in the .html file.
  //   path         the page's public URL path
  //   type         og:type — "website" or "profile"
  //   image        optional share image; defaults to assets/img/info/head-knot.png
  pages: {
    "index.html": {
      path: "/",
      title: "Dominic DeCarlo — Brand & Visual Designer",
      description: "Portfolio of Dominic DeCarlo, a brand and visual designer in San Francisco. Brand identity, campaign, editorial and animation work.",
    },
    "info.html": {
      path: "/info",
      type: "profile",
      title: "Info — Dominic DeCarlo",
      description: "About Dominic DeCarlo, a brand and visual designer working across brand identity, campaign, event and product animation design.",
    },
    "scraps.html": {
      path: "/scraps",
      title: "Scraps — Dominic DeCarlo",
      description: "Scraps: an ongoing feed of references, sketches and things worth keeping, collected by Dominic DeCarlo.",
    },
    "scrap-designer.html": {
      path: "/scrap-designer",
      title: "The Scrap Designer — Dominic DeCarlo",
      description: "The Scrap Designer: an interactive scrap board by Dominic DeCarlo — drag, rotate and scatter a live collection of references.",
    },
  },
};

/* ============================================================
   PROJECTS
   One file per project in content/projects/<id>.js. This list is the order they
   appear on the home grid — add a new project's file name here.
   ============================================================ */
const PROJECT_FILES = [
  "strava",
  "solv",
  "sfstate",
  "newbabyironage",
  "ssd",
  "pena",
  "apparel",
  "sfstateboldthinking",
  "aip",
  "waving",
  "pasta",
];

const PROJECTS = [];
function project(p) { PROJECTS.push(p); }

/* Load each project file, in order, then resolve PROJECTS_READY — main.js waits
   on it before rendering. async=false keeps dynamically added scripts running
   in the order they were added. scripts/build-seo.mjs reads the same files itself, so
   none of this runs there (no `document`). */
const PROJECTS_READY =
  typeof document === "undefined"
    ? null
    : Promise.all(
        PROJECT_FILES.map(
          (f) =>
            new Promise((resolve) => {
              const s = document.createElement("script");
              s.src = `content/projects/${f}.js`;
              s.async = false;
              s.onload = resolve;
              s.onerror = () => {
                console.error(`Couldn't load content/projects/${f}.js — is it in PROJECT_FILES but missing on disk?`);
                resolve(); // one bad file shouldn't take down the whole site
              };
              document.head.append(s);
            })
        )
      );
