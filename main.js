/* ============================================================
   main.js — renders top bar, Are.na feed, portfolio grid,
   and project detail pages. Reads everything from data.js.
   ============================================================ */

/* ---------- helpers ---------- */
const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (v !== null && v !== undefined) n.setAttribute(k, v);
  }
  kids.flat().forEach((c) => n.append(c?.nodeType ? c : document.createTextNode(c ?? "")));
  return n;
};
const qs = (name) => new URLSearchParams(location.search).get(name);

/* ---------- top bar (3 zones: left wordmark / center info / right nav) ---------- */
/* Links are written without .html (GitHub Pages resolves /info -> info.html),
   but `data-page` on <body> still uses the filename as its internal key — it's
   also what data.js keys `modeByPage` on. So compare pages by a normalized key
   instead of by raw string, letting the two forms differ freely.
   Returns null for anything that isn't a local page (http, mailto, #). */
function pageKey(href) {
  const s = String(href || "").split(/[?#]/)[0];
  if (!s || /^[a-z][a-z0-9+.-]*:/i.test(s) || s.startsWith("#")) return null;
  return (
    s
      .replace(/^\/+/, "")
      .replace(/(^|\/)index\.html$/, "")
      .replace(/\.html$/, "")
      .replace(/\/$/, "") || "index"
  );
}
const samePage = (a, b) => {
  const k = pageKey(a);
  return k !== null && k === pageKey(b);
};

function renderTopbar(activeHref) {
  const bar = document.querySelector(".topbar");
  if (!bar) return;

  // LEFT: logo mark + wordmark
  const left = el("a", { class: "tb-left", href: "/" });
  if (SITE.logo) left.append(el("img", { class: "tb-logo", src: SITE.logo, alt: "" }));
  else left.append(el("span", { class: "tb-logo-mark" }, "◎"));
  left.append(el("span", { class: "wordmark" }, SITE.name));

  // CENTER: flexible zone. On the home page it carries the intro description
  // (next to the wordmark); on other pages it uses the generic centerInfo/links.
  const isHome = samePage(activeHref, "index.html");
  const center = el("div", { class: "tb-center" });
  const infoHtml = isHome && SITE.intro ? SITE.intro : SITE.centerInfo;
  if (infoHtml) center.append(el("span", { class: "tb-info", html: infoHtml }));
  const links = isHome && SITE.contactLinks?.length ? SITE.contactLinks : SITE.centerLinks || [];
  if (links.length) {
    const cl = el("span", { class: "tb-center-links" });
    links.forEach((l) =>
      cl.append(el("a", { href: l.href, target: l.href.startsWith("http") ? "_blank" : null }, l.label))
    );
    center.append(cl);
  }

  // RIGHT: main nav. An item with a `children` array renders as a dropdown;
  // otherwise it's a plain link.
  const nav = el("nav", { class: "tb-nav" });
  SITE.nav.forEach((n) => {
    if (n.children?.length) {
      const wrap = el("div", { class: "tb-dropdown" });
      const childActive = n.children.some((c) => samePage(c.href, activeHref));
      const toggle = el(
        "button",
        {
          class: "tb-drop-toggle" + (childActive ? " active" : ""),
          type: "button",
          "aria-haspopup": "true",
          "aria-expanded": "false",
        },
        n.label
      );
      const menu = el("div", { class: "tb-menu" });
      n.children.forEach((c) => {
        const ext = c.href.startsWith("http");
        menu.append(
          el(
            "a",
            {
              href: c.href,
              class: samePage(c.href, activeHref) ? "active" : "",
              target: ext ? "_blank" : null,
              rel: ext ? "noopener" : null,
            },
            c.label
          )
        );
      });
      wrap.append(toggle, menu);

      // Click toggles (needed for touch + keyboard); hover is handled in CSS.
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const open = wrap.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Close on outside click or Escape.
      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) {
          wrap.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      wrap.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          wrap.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });

      nav.append(wrap);
    } else {
      nav.append(el("a", { href: n.href, class: samePage(n.href, activeHref) ? "active" : "" }, n.label));
    }
  });

  bar.append(left, center, nav);
}

/* ---------- description band (below the header) ---------- */
function renderSubhead() {
  const bar = document.querySelector(".subhead");
  if (!bar) return;
  if (SITE.intro) bar.append(el("div", { class: "subhead-text", html: SITE.intro }));
  if (SITE.contactLinks?.length) {
    const links = el("div", { class: "subhead-links" });
    SITE.contactLinks.forEach((l) =>
      links.append(el("a", { href: l.href, target: l.href.startsWith("http") ? "_blank" : null }, l.label))
    );
    bar.append(links);
  }
  syncStackHeight();
}

/* Measure the fixed header stack (top bar + description band) and offset the
   layout below it. Recalculates on resize so wrapping text never overlaps. */
function syncStackHeight() {
  const topbar = document.querySelector(".topbar");
  const sub = document.querySelector(".subhead");
  const h = (topbar?.offsetHeight || 0) + (sub?.offsetHeight || 0);
  document.documentElement.style.setProperty("--stack-h", h + "px");
}

/* ---------- resizable divider between left & right columns ---------- */
function initResizer() {
  const layout = document.querySelector(".layout");
  const divider = document.querySelector(".divider");
  const left = document.querySelector(".left");
  if (!layout || !divider || !left) return;

  const MIN = 140; // px — minimum width for either column
  const KEY = "decarlo:leftWidth";

  // restore saved width
  const saved = localStorage.getItem(KEY);
  if (saved) left.style.width = saved;

  let dragging = false;
  const onMove = (clientX) => {
    const rect = layout.getBoundingClientRect();
    let w = clientX - rect.left;
    w = Math.max(MIN, Math.min(w, rect.width - MIN - divider.offsetWidth));
    left.style.width = w + "px";
  };

  const start = (e) => {
    dragging = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  };
  const stop = () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    localStorage.setItem(KEY, left.style.width);
  };

  divider.addEventListener("mousedown", start);
  window.addEventListener("mousemove", (e) => dragging && onMove(e.clientX));
  window.addEventListener("mouseup", stop);
  // touch
  divider.addEventListener("touchstart", start, { passive: false });
  window.addEventListener("touchmove", (e) => dragging && onMove(e.touches[0].clientX), { passive: false });
  window.addEventListener("touchend", stop);
  // double-click to reset
  divider.addEventListener("dblclick", () => {
    left.style.width = "";
    localStorage.removeItem(KEY);
  });
}

/* ---------- Are.na feed with infinite scroll ---------- */
function arenaBlock(b) {
  const img = b.image && (b.image.display?.url || b.image.large?.url || b.image.original?.url);
  const link = b.source?.url || (b.id ? `https://www.are.na/block/${b.id}` : "#");
  const wrap = el("a", { class: "scrap", href: link, target: "_blank", rel: "noopener" });
  if (img) {
    wrap.append(el("img", { src: img, alt: b.title || "scrap", loading: "lazy" }));
    if (b.title) wrap.append(el("div", { class: "scrap-cap" }, b.title));
  } else if (b.class === "Text" && b.content) {
    wrap.append(el("div", { class: "scrap-text" }, b.content));
  } else if (b.title || b.description) {
    wrap.append(el("div", { class: "scrap-text" }, b.title || b.description));
  }
  return wrap.childNodes.length ? wrap : null;
}

function renderArena() {
  const mount = document.getElementById("arena");
  if (!mount) return;
  if (mount.offsetParent === null) return; // hidden (e.g. Scraps feed on mobile home) — don't fetch
  const { channelSlug } = SITE.arena;
  const per = SITE.arena.perPage || 24;

  const feed = el("div", { class: "arena-feed" });
  const status = el("div", { class: "arena-status" }, "Loading scraps…");
  const sentinel = el("div", { class: "arena-sentinel" });
  mount.append(feed, status, sentinel);

  // nearest scrollable ancestor (the left column, or the full Scraps column)
  const scroller = mount.closest(".left, .right") || null;

  let page = 1, done = false, loading = false, totalPages = Infinity, any = false;

  const sentinelNear = () => {
    const r = sentinel.getBoundingClientRect();
    const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
    return r.top <= bottom + 250;
  };

  async function loadMore() {
    if (loading || done) return;
    loading = true;
    status.textContent = "Loading scraps…";
    try {
      const res = await fetch(
        `https://api.are.na/v2/channels/${channelSlug}/contents?page=${page}&per=${per}&direction=desc`
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      totalPages = data.total_pages || Math.ceil((data.length || 0) / per) || totalPages;
      const blocks = data.contents || [];
      blocks.forEach((b) => {
        const n = arenaBlock(b);
        if (n) { feed.append(n); any = true; }
      });
      page++;
      if (blocks.length < per || page > totalPages) {
        done = true;
        observer.disconnect();
        status.textContent = any ? "THAT'S ALL FOR NOW!" : "No blocks found in channel.";
        status.classList.toggle("arena-end", any);
      } else {
        status.textContent = "";
      }
    } catch (err) {
      done = true;
      observer.disconnect();
      status.textContent = "Couldn't load Are.na channel “" + channelSlug + "”. Check the slug in data.js.";
    } finally {
      loading = false;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => { if (entries.some((e) => e.isIntersecting)) fill(); },
    { root: scroller, rootMargin: "300px" }
  );
  observer.observe(sentinel);

  // Load pages until the sentinel is pushed out of view (or we run out).
  async function fill() {
    await loadMore();
    if (!done && sentinelNear()) requestAnimationFrame(fill);
  }
  fill();
}

/* ---------- portfolio grid (home, right column) ---------- */
function makeTileCarousel(p, href) {
  const media = p.images && p.images.length ? p.images : p.cover ? [p.cover] : [];
  const car = el("div", { class: "tile-carousel" });
  const track = el("div", { class: "tile-track" });
  media.forEach((src) => {
    const slide = el("a", { class: "tile-slide", href });
    slide.append(
      isVideo(src)
        ? el("video", { src, muted: "", playsinline: "" })
        : el("img", { src, alt: p.title, loading: "lazy" })
    );
    track.append(slide);
  });
  car.append(track);

  if (media.length > 1) {
    const dots = el("div", { class: "tile-dots" });
    let idx = 0;
    const go = (i) => {
      idx = (i + media.length) % media.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.querySelectorAll(".tdot").forEach((d, di) => d.classList.toggle("active", di === idx));
    };
    // stop clicks on controls from following the tile link
    const guard = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };

    media.forEach((_, i) => {
      const d = el("button", { class: "tdot" + (i === 0 ? " active" : ""), "aria-label": "Image " + (i + 1) });
      d.addEventListener("click", guard(() => go(i)));
      dots.append(d);
    });
    const prev = el("button", { class: "tcar-btn prev", "aria-label": "Previous" }, "‹");
    const next = el("button", { class: "tcar-btn next", "aria-label": "Next" }, "›");
    prev.addEventListener("click", guard(() => go(idx - 1)));
    next.addEventListener("click", guard(() => go(idx + 1)));
    car.append(prev, next, dots);

    // touch swipe
    let x0 = null;
    track.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
  return car;
}

function renderGrid() {
  const mount = document.getElementById("grid");
  if (!mount) return;
  const grid = el("div", { class: "grid" });
  // Only fully hidden projects are kept off the grid; private ones still show
  // (clickable into a locked placeholder page).
  PROJECTS.filter((p) => !p.hidden).forEach((p) => {
    const href = projectHref(p);
    const tile = el("div", { class: "tile" });
    tile.append(makeTileCarousel(p, href));
    tile.append(
      el(
        "a",
        { class: "tile-metalink", href },
        el(
          "div",
          { class: "tile-meta" },
          el("span", { class: "tile-title" }, p.title),
          el("span", { class: "tile-year" }, p.year || "")
        ),
        p.tags ? el("div", { class: "tile-tags" }, p.tags) : ""
      )
    );
    grid.append(tile);
  });
  mount.append(grid);
}

/* ---------- helpers for project pages ---------- */
/* A project's canonical URL slug and href. Prerendered pages are written to
   work/<slug>.html — see build-seo.mjs, which must use this same slug rule —
   and served at /work/<slug>, since GitHub Pages resolves the extension.
   Root-relative, so the href is the same from any page depth. */
const projectSlug = (p) => String(p.id).toLowerCase();
const projectHref = (p) => `/work/${encodeURIComponent(projectSlug(p))}`;

/* Which project this page shows. `?id=` wins (legacy project.html?id=… links);
   otherwise fall back to the prerendered page's data-project-id (work/<id>/). */
const currentProject = () => {
  const id = qs("id") || document.body.dataset.projectId;
  return PROJECTS.find((x) => x.id === id) || PROJECTS[0];
};
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

/* Normalize a YouTube/Vimeo (or already-embed) URL into an embeddable player URL. */
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return "https://www.youtube.com/embed" + u.pathname;
    if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return "https://www.youtube.com/embed/" + u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) return "https://www.youtube.com/embed/" + u.pathname.split("/")[2];
      return url; // already /embed/...
    }
    if (host === "player.vimeo.com") return url;
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return "https://player.vimeo.com/video/" + id;
    }
    return url; // unknown host — use as-is
  } catch (e) {
    return url;
  }
}

/* Pull the YouTube video id out of any youtube / youtu.be URL (else null). */
function youtubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") return parts[1] || null;
    }
  } catch (e) {}
  return null;
}

/* append a stacked run of images/videos into a container */
function appendMedia(container, media, altBase) {
  (media || []).forEach((src) => {
    container.append(
      isVideo(src)
        ? el("video", { class: "media", src, controls: "", playsinline: "" })
        : el("img", { class: "media", src, alt: altBase || "", loading: "lazy" })
    );
  });
}

/* render one sidebar entry into a container (shared by credits + custom sidebar) */
function piEntry(container, c) {
  if (c.embed) {
    // { embed: "youtube/vimeo url", caption? } → responsive player in the sidebar.
    // On file:// the origin is null and YouTube's player errors (153), so fall
    // back to a clickable thumbnail that opens the video in a new tab.
    const fig = el("figure", { class: "pi-embed" });
    const ytId = youtubeId(c.embed);
    if (location.protocol === "file:") {
      const watch = ytId ? "https://www.youtube.com/watch?v=" + ytId : c.embed;
      const link = el("a", {
        class: "pi-embed-frame pi-embed-fallback",
        href: watch,
        target: "_blank",
        rel: "noopener",
        title: "Open video",
      });
      if (ytId) link.append(el("img", { src: "https://i.ytimg.com/vi/" + ytId + "/hqdefault.jpg", alt: c.caption || "video", loading: "lazy" }));
      link.append(el("span", { class: "pi-embed-play" }, "▶"));
      fig.append(link);
    } else {
      const frame = el("div", { class: "pi-embed-frame" });
      frame.append(
        el("iframe", {
          src: toEmbedUrl(c.embed),
          title: "video",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          // required by YouTube — without it the player fails with "error 153"
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: "",
          loading: "lazy",
        })
      );
      fig.append(frame);
    }
    if (c.caption) fig.append(el("figcaption", { html: c.caption }));
    container.append(fig);
  } else if (c.image || c.video) {
    // { image: "url" } or { video: "clip.mp4" }, with optional caption.
    // An .mp4/.webm/.mov path in either field renders as a looping video.
    const src = c.video || c.image;
    const fig = el("figure", { class: "pi-image" });
    if (isVideo(src)) {
      const v = el("video", { src, loop: "", playsinline: "", preload: "metadata" });
      // Set muted/autoplay as PROPERTIES (not just attributes) so muted
      // autoplay is honored on a cold page refresh, not only after a click.
      v.muted = true;
      v.playsInline = true;
      if (c.controls) {
        v.controls = true;
      } else {
        v.autoplay = true;
        v.setAttribute("autoplay", "");
        v.addEventListener("canplay", () => { v.play().catch(() => {}); }, { once: true });
      }
      fig.append(v);
    } else {
      fig.append(el("img", { src, alt: c.caption || "", loading: "lazy" }));
    }
    if (c.caption) fig.append(el("figcaption", { html: c.caption }));
    container.append(fig);
  } else if (c.heading) {
    // { heading: "..." } — small subheading
    container.append(el("div", { class: "pi-subheading" }, c.heading));
  } else if (c.title) {
    // { title: "..." } — bold title line
    container.append(el("div", { class: "pi-title" }, c.title));
  } else if (c.text) {
    // { text: "..." } — free paragraph (HTML/links allowed)
    container.append(el("p", { class: "pi-text", html: c.text }));
  } else if (c.label && c.value != null) {
    // { label: "Year", value: "2018" } — a labelled fact row
    const dl = el("dl", { class: "pi-facts" });
    dl.append(el("dt", {}, c.label), el("dd", { html: String(c.value) }));
    container.append(dl);
  } else if (c.role || c.name) {
    // { role, name, href? } — a credit line
    const line = el("div", { class: "pi-credit-line" });
    if (c.role) line.append(el("span", { class: "role" }, c.role + ": "));
    if (c.href) line.append(el("a", { href: c.href, target: "_blank", rel: "noopener" }, c.name || c.href));
    else if (c.name) line.append(c.name);
    container.append(line);
  }
}

/* left "quick info" panel on a project page */
function renderProjectInfo() {
  const mount = document.getElementById("proj-info");
  if (!mount) return;
  const p = currentProject();

  // Back link shows only on mobile (replaces the "Info" label there);
  // the "Info" label shows only on desktop.
  mount.append(el("a", { class: "pi-back", href: "/" }, "← WORK"));
  mount.append(el("p", { class: "left-heading pi-head-label" }, "Info"));
  const info = el("div", { class: "proj-info" });

  if (p.sidebar?.length) {
    // Full manual control: render blocks in the exact order given.
    p.sidebar.forEach((c) => piEntry(info, c));
  } else {
    // Default auto layout: summary → facts → credits.
    // (Title is intentionally omitted — the main column already shows it as the H1.)
    if (p.summary) info.append(el("p", { class: "pi-summary" }, p.summary));

    const facts = el("dl", { class: "pi-facts" });
    const fact = (k, v) => { if (v) { facts.append(el("dt", {}, k), el("dd", {}, v)); } };
    fact("Year", p.year);
    fact("Discipline", p.tags);
    if (facts.childNodes.length) info.append(facts);

    if (p.credits?.length) {
      const cr = el("div", { class: "pi-credits" });
      p.credits.forEach((c) => piEntry(cr, c));
      info.append(cr);
    }
  }
  mount.append(info);
}

/* ---------- info page (left column: photo + bio + contact) ---------- */
function renderInfo() {
  const mount = document.getElementById("info-left");
  if (!mount) return;
  const info = SITE.info || {};

  if (info.photo) {
    mount.append(el("img", { class: "info-photo", src: info.photo, alt: SITE.name, loading: "lazy" }));
  }
  const bio = el("div", { class: "info-bio" });
  (info.bio || []).forEach((para) => bio.append(el("p", { html: para })));
  mount.append(bio);

  if (info.links?.length) {
    const links = el("div", { class: "info-links" });
    info.links.forEach((l) =>
      links.append(el("a", { href: l.href, target: l.href.startsWith("http") ? "_blank" : null, rel: "noopener" }, l.label))
    );
    mount.append(links);
  }
}

/* ---------- landing page contact row (scrap-designer.html) ----------
   Reuses SITE.info.links so the landing page and the Info page never drift. */
function renderLandingLinks() {
  const mount = document.getElementById("landing-links");
  if (!mount) return;
  (SITE.info?.links || []).forEach((l) =>
    mount.append(el("a", { href: l.href, target: l.href.startsWith("http") ? "_blank" : null, rel: "noopener" }, l.label))
  );
}

/* ---------- info canvas (the scrap board) ----------
   Pulls the newest scraps from the Are.na channel and drops each into a small
   draggable / resizable / rotatable / closeable window, scoped to #info-canvas.
   Drives both the Info page's right column and the full-bleed landing stage.
   Three modes, switchable via an on-canvas toggle (each page remembers its own
   choice; SITE.infoCanvas.modeByPage sets which one a page opens in):
     "board"  — click / Space / auto-drop into random spots (the original).
     "trail"  — images reveal along the cursor's path and fade as new ones come;
                anything you grab becomes a permanent keeper.
     "wheel"  — no windows at all: a slow-turning ring of images on a dark
                stage that streams fresh scraps as it spins. Hover pops an
                image forward, clicking opens it full-screen, and on-canvas
                sliders shape the ring.
   In board and trail the whole board can be tidied into a grid or scattered at
   random, and scraps are placed by clicking the canvas (Space adds one too).
   Keys: space add · t switch · g tidy/reshuffle · s scatter · c clear.
   Config: SITE.infoCanvas. */
function renderInfoCanvas() {
  const canvas = document.getElementById("info-canvas");
  if (!canvas) return;

  const cfg = SITE.infoCanvas || {};
  if (cfg.enabled === false) return;

  const slug = cfg.channelSlug || SITE.arena?.channelSlug;
  if (!slug) return;

  const GUARANTEED = cfg.guaranteedNew ?? 10;
  const AUTO_INTERVAL = cfg.autoInterval ?? 2200;
  const INITIAL_DELAY = cfg.initialDelay ?? 2500;
  const MAX_AUTO = cfg.maxAuto ?? 0;
  const DEF_W = cfg.defaultWidth ?? 250;
  const WIDE_W = cfg.wideWidth ?? 420;
  const TRAIL_DISTANCE = cfg.trailDistance ?? 90;
  const TRAIL_MAX = cfg.trailMax ?? 22;
  /* Wheel mode's ring. The code calls it the "deck" throughout — the same names
     the ring was written with elsewhere in the site's history, kept so the two
     copies stay easy to diff — while the button and the directions say "wheel". */
  const DECK_TILE = cfg.deckTile ?? 200;     // wheel: base image size (px)
  const DECK_COUNT = cfg.deckCount ?? 40;    // wheel: images around the ring
  const DECK_SPEED = cfg.deckSpeed ?? 0.25;  // wheel: rotation speed (radians/sec, CCW)
  const DECK_TILT = cfg.deckTilt ?? -0.6;    // wheel: ring tilt (radians)
  const DECK_FLAT = cfg.deckFlat ?? 0.34;    // wheel: ellipse flatness (minor/major)
  const DECK_SCALE_MIN = 0.5, DECK_SCALE_MAX = 1.15; // back → front size range
  const MODES = ["trail", "board", "deck"];
  const LABELS = { trail: "trail", board: "board", deck: "wheel" };
  // config and the UI say "wheel"; the code says "deck"
  const normalizeMode = (m) => (m === "wheel" ? "deck" : m);

  /* Each page starts in its own mode and remembers its own choice, so switching
     to trail on the landing page doesn't change how the Info page opens (and
     vice versa) — hence the page in the storage key. */
  const page = document.body.dataset.page || "landing";
  const MODE_KEY = "decarlo:infoMode:" + page;

  // Mobile / touch defaults to board — the trail needs a hovering cursor.
  const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 820px)").matches);
  const pageMode = (cfg.modeByPage || {})[page];
  const defaultMode = normalizeMode(isMobile ? (cfg.mobileMode || "board") : (pageMode || cfg.mode || "trail"));

  // Starting mode: this page's saved choice always wins; otherwise use the
  // device- and page-appropriate default above.
  let MODE = defaultMode;
  try { MODE = normalizeMode(localStorage.getItem(MODE_KEY)) || defaultMode; } catch (e) {}
  if (!MODES.includes(MODE)) MODE = "trail";

  // --- state ---
  let pool = [];                // {url, filename} sorted newest→oldest
  const used = new Set();       // indices currently placed
  let displayed = 0;            // count placed since last clear
  let guaranteedOrder = [];     // shuffled [0..GUARANTEED-1]
  let autoCount = 0;
  let autoTimer = null;
  let baseZ = 10;
  let interacting = false;      // true while dragging/resizing/rotating a window
  const trailQueue = [];        // ambient (untouched) trail windows, oldest first

  // wheel ("deck") state — the ring, its tiles, and the live slider values
  let deck = null;                 // the ring's container element
  let deckTiles = [], deckMeta = null, deckNextImg = 0, deckRAF = 0, deckRot = 0, deckSwapAcc = 0;
  let deckCount = DECK_COUNT;      // ring size (adjustable)
  let deckSpeed = DECK_SPEED;      // rotation speed (adjustable)
  let deckTileSize = DECK_TILE;    // image size (adjustable)
  let deckTilt = DECK_TILT;        // ring tilt in radians (adjustable)
  let deckFlat = DECK_FLAT;        // ellipse flatness b/a (adjustable)
  let deckControls = null, actionBar = null;
  let lb = null, lbIdx = 0;        // full-screen viewer + the scrap it's showing

  /* All windows live in their own layer. It's a stacking context, so however
     high a window's z-index climbs it can never rise above the controls, which
     are siblings of the layer. */
  const layer = el("div", { class: "ic-layer" });
  canvas.append(layer);

  // --- ui: hint + status + mode toggle, layered above the board ---
  const hint = el("div", { class: "ic-hint" });
  const status = el("div", { class: "ic-status" }, "Loading scraps…");
  const keysEl = el("div", { class: "ic-hint-keys" });
  hint.append(status, keysEl);
  canvas.append(hint);

  /* The directions read as a stacked list down the left edge — one instruction
     per line — so split the mode's line on its separators. */
  function updateHint() {
    const line =
      cfg.hint ||
      (MODE === "deck"
        ? "a turning wheel · hover to zoom · click to enlarge · t switch · g reshuffle"
        : (MODE === "trail" ? "move to reveal · drag to keep" : "click / space to add · drag to organize") +
          " · t switch · g tidy · s scatter · c clear");
    keysEl.textContent = "";
    line
      .split("·")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => keysEl.append(el("span", { class: "ic-hint-line" }, part)));
  }

  // mode toggle (top-right)
  if (cfg.showToggle !== false) {
    const toggle = el("div", { class: "ic-toggle" });
    MODES.forEach((m) => {
      const b = el("button", { class: "ic-mode" + (m === MODE ? " on" : ""), "data-mode": m }, LABELS[m] || m);
      b.addEventListener("click", (e) => { e.stopPropagation(); if (m !== MODE) setMode(m); });
      toggle.append(b);
    });
    canvas.append(toggle);
  }

  /* Action bar (under the mode toggle): the board-wide arrangements as buttons,
     so the keyboard shortcuts aren't the only way in — needed on touch, where
     there are no keys at all. Adding a scrap isn't in here: tap or click the
     canvas (or hit Space) and one lands where you pointed. The bar is for the
     window modes only, so wheel mode hides it and shows its sliders instead.
     Set cfg.showActions = false to hide the bar. */
  if (cfg.showActions !== false) {
    const acts = [
      ["tidy", "Tidy into a grid (g)", () => tidyUp()],
      ["scatter", "Scatter at random (s)", () => scatter()],
      ["clear", "Clear the board (c)", () => clearAll()],
    ];
    actionBar = el("div", { class: "ic-actions" });
    acts.forEach(([label, title, fn]) => {
      const b = el("button", { class: "ic-act", type: "button", title }, label);
      b.addEventListener("click", (e) => { e.stopPropagation(); fn(); });
      actionBar.append(b);
    });
    if (MODE === "deck") actionBar.style.display = "none";
    canvas.append(actionBar);
  }

  /* Wheel sliders, stacked under the directions: how many images ride the ring,
     how fast it turns, how the ellipse is tilted and flattened, and how big the
     images are. They only appear in wheel mode. */
  {
    // one labelled range row
    const makeRow = (labelText, attrs, onInput) => {
      const lab = el("span", { class: "ic-slider-label" }, labelText);
      const range = el("input", Object.assign({ type: "range", class: "ic-slider-range" }, attrs));
      range.addEventListener("input", (e) => { e.stopPropagation(); onInput(range, lab); });
      range.addEventListener("click", (e) => e.stopPropagation());
      return el("div", { class: "ic-slider" }, lab, range);
    };
    // tilt / shape / size only move the tiles, so re-place them where they are
    const relayoutDeck = () => { if (deckMeta) deckTiles.forEach(layoutTile); };

    deckControls = el("div", { class: "ic-controls" });
    let countTO = null;
    deckControls.append(makeRow(
      deckCount + " images",
      { min: "20", max: "60", value: String(deckCount), "aria-label": "Number of images" },
      (range, lab) => {
        deckCount = parseInt(range.value) || deckCount;
        lab.textContent = deckCount + " images";
        // a new count means a new ring; debounce so dragging doesn't rebuild per pixel
        clearTimeout(countTO);
        countTO = setTimeout(() => { if (MODE === "deck") { const r = deckRot; buildDeck(); deckRot = r; } }, 40);
      }
    ));
    deckControls.append(makeRow(
      "speed",
      { min: "0", max: "1.2", step: "0.05", value: String(deckSpeed), "aria-label": "Rotation speed" },
      (range) => { deckSpeed = parseFloat(range.value); }   // 0 = parked
    ));
    deckControls.append(makeRow(
      "tilt",
      { min: "-90", max: "90", step: "1", value: String(Math.round(deckTilt * 180 / Math.PI)), "aria-label": "Ring tilt" },
      (range) => {
        deckTilt = parseFloat(range.value) * Math.PI / 180;
        if (deckMeta) { deckMeta.cosT = Math.cos(deckTilt); deckMeta.sinT = Math.sin(deckTilt); }
        relayoutDeck();
      }
    ));
    deckControls.append(makeRow(
      "shape",
      { min: "0.12", max: "0.7", step: "0.02", value: String(deckFlat), "aria-label": "Ellipse shape" },
      (range) => {
        deckFlat = parseFloat(range.value);
        if (deckMeta) deckMeta.b = deckMeta.a * deckFlat;
        relayoutDeck();
      }
    ));
    deckControls.append(makeRow(
      "size",
      { min: "100", max: "320", step: "10", value: String(deckTileSize), "aria-label": "Image size" },
      (range) => {
        deckTileSize = parseInt(range.value) || deckTileSize;
        deckTiles.forEach((t) => { t.el.style.width = deckTileSize + "px"; });
      }
    ));
    deckControls.style.display = MODE === "deck" ? "flex" : "none";
    hint.append(deckControls);
  }

  function setMode(m) {
    const prev = MODE;
    MODE = m;
    try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
    canvas.querySelectorAll(".ic-mode").forEach((b) => b.classList.toggle("on", b.dataset.mode === m));
    updateHint();
    // the sliders belong to the wheel, the action bar to the window modes
    if (deckControls) deckControls.style.display = m === "deck" ? "flex" : "none";
    if (actionBar) actionBar.style.display = m === "deck" ? "none" : "flex";
    if (prev === "deck" && m !== "deck") destroyDeck();
    if (m === "deck") {
      stopAuto();
      // the ring owns the whole canvas, so sweep the windows off it first
      if (prev !== "deck") { clearAll(); buildDeck(); }
    } else if (m === "board") {
      startBoard(300);
    } else {
      stopAuto();
    }
  }
  const cycleMode = () => setMode(MODES[(MODES.indexOf(MODE) + 1) % MODES.length]);

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const initGuaranteed = () => {
    guaranteedOrder = shuffle(Array.from({ length: Math.min(GUARANTEED, pool.length) }, (_, i) => i));
  };

  // Weighted pick favoring newer images; first GUARANTEED come out newest-first
  // (shuffled). Never repeats an image until the pool is exhausted.
  const pickIndex = () => {
    const avail = pool.map((_, i) => i).filter((i) => !used.has(i));
    if (!avail.length) return -1;
    if (displayed < guaranteedOrder.length) {
      const idx = guaranteedOrder[displayed];
      if (idx != null && !used.has(idx)) return idx;
    }
    const weighted = [];
    avail.forEach((i) => {
      let w = 1;
      if (i < 10) w = 5; else if (i < 30) w = 3; else if (i < 60) w = 2;
      for (let k = 0; k < w; k++) weighted.push(i);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
  };

  const topZ = () => {
    const wins = canvas.querySelectorAll(".ic-window");
    return Math.max(baseZ, ...[...wins].map((w) => parseInt(w.style.zIndex) || baseZ));
  };
  const bringFront = (win) => { win.style.zIndex = topZ() + 1; };

  // --- build one window around an image ---
  function makeWindow(item) {
    const win = el("div", { class: "ic-window" });
    win.dataset.rotation = "0";

    const header = el("div", { class: "ic-head" });
    const title = el("span", { class: "ic-title" }, "<" + (item.filename || "scrap") + ">");
    const rot = el("button", { class: "ic-rotate", title: "Rotate", "aria-label": "Rotate" }, "⟲");
    const close = el("button", { class: "ic-close", title: "Close", "aria-label": "Close" }, "×");
    header.append(title, rot, close);

    const body = el("div", { class: "ic-body" });
    const img = el("img", { src: item.url, alt: item.filename || "", draggable: "false", loading: "lazy" });
    body.append(img);

    const grip = el("div", { class: "ic-resize", "aria-label": "Resize" });
    win.append(header, body, grip);

    // Are.na doesn't reliably expose image dimensions, so start at the default
    // width and promote to the wide width once the image reports its natural
    // aspect ratio (> 1.3 = wide).
    win.style.width = DEF_W + "px";
    const applyWide = () => {
      if (img.naturalWidth && img.naturalWidth / img.naturalHeight > 1.3) {
        win.style.width = WIDE_W + "px";
      }
    };
    if (img.complete && img.naturalWidth) applyWide();
    else img.addEventListener("load", applyWide, { once: true });

    makeDraggable(win);
    makeResizable(win, img);
    makeRotatable(win, rot);
    close.addEventListener("click", (e) => { e.stopPropagation(); removeWindow(win); });

    return win;
  }

  // free a window's resources and remove it (immediately)
  function removeWindow(win) {
    const k = trailQueue.indexOf(win);
    if (k >= 0) trailQueue.splice(k, 1);
    const idx = parseInt(win.dataset.poolIndex);
    if (!isNaN(idx)) used.delete(idx); // let the image be revealed again later
    win.remove();
  }

  // fade a window out, then free it (used when the trail outgrows its cap)
  function fadeRemove(win) {
    win.classList.remove("ic-spawn");
    win.classList.add("ic-out");
    const done = () => removeWindow(win);
    win.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 600); // fallback if transitionend doesn't fire
  }

  // a trail image the visitor grabs becomes a permanent keeper
  function markTouched(win) {
    if (win.dataset.untouched) {
      delete win.dataset.untouched;
      const k = trailQueue.indexOf(win);
      if (k >= 0) trailQueue.splice(k, 1);
    }
  }

  // keep only the newest TRAIL_MAX ambient images; older untouched ones fade
  function pruneTrail() {
    while (trailQueue.length > TRAIL_MAX) {
      const old = trailQueue.shift();
      if (old) fadeRemove(old);
    }
  }

  /* Place an image. opts:
       { x, y }   place centered near these canvas coords (else random)
       { trail }  track as an ambient trail image (fades when the cap is passed) */
  function dropImage(opts = {}) {
    if (!pool.length) return false;
    const i = pickIndex();
    if (i < 0) return false;
    used.add(i);
    displayed++;

    const win = makeWindow(pool[i]);
    win.dataset.poolIndex = i;

    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    let x, y;
    if (opts.x != null) {
      x = opts.x - DEF_W / 2;   // center on the cursor
      y = opts.y - 18;
    } else {
      const winH = Math.min(ch * 0.8, WIDE_W * 0.9 + 60);
      x = Math.random() * Math.max(1, cw - WIDE_W);
      y = Math.random() * Math.max(1, ch - winH);
    }
    x = Math.max(4, Math.min(x, Math.max(4, cw - 90)));
    y = Math.max(4, Math.min(y, Math.max(4, ch - 60)));
    win.style.left = Math.round(x) + "px";
    win.style.top = Math.round(y) + "px";
    win.style.zIndex = topZ() + 1;

    // fade/scale in, then drop the class so it can't fight a later rotation
    win.classList.add("ic-spawn");
    win.addEventListener("animationend", () => win.classList.remove("ic-spawn"), { once: true });

    if (opts.trail) {
      win.dataset.untouched = "1";
      trailQueue.push(win);
      pruneTrail();
    }

    layer.append(win);
    return true;
  }

  function clearAll() {
    canvas.querySelectorAll(".ic-window").forEach((w) => w.remove());
    trailQueue.length = 0;
    used.clear();
    displayed = 0;
    autoCount = 0;
    initGuaranteed();
  }

  // animate left/top/width/rotation to their new values, then drop the class so
  // it can't slow down a subsequent drag
  function tween(win) {
    win.classList.add("ic-tween");
    setTimeout(() => win.classList.remove("ic-tween"), 520);
  }

  /* Tidy up — pack everything on the board into a centered grid: uniform width,
     rotation straightened, natural heights preserved, stacking order flattened.
     Tidied windows become keepers (an arranged board shouldn't decay). */
  function tidyUp() {
    const wins = [...canvas.querySelectorAll(".ic-window")];
    if (!wins.length) return;

    const GAP = 14;
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    const W = Math.min(DEF_W, Math.max(120, cw - GAP * 2));
    const cols = Math.max(1, Math.min(wins.length, Math.floor((cw - GAP) / (W + GAP))));

    // straighten and set the shared width first, then measure the real heights
    wins.forEach((win) => {
      markTouched(win);
      tween(win);
      win.dataset.rotation = "0";
      win.style.transform = "rotate(0deg)";
      win.style.width = W + "px";
      win.style.height = "";       // back to natural (a resize may have fixed it)
      win.style.zIndex = baseZ;
    });

    // row heights come from the tallest window in each row
    const rows = [];
    wins.forEach((win, i) => {
      const r = Math.floor(i / cols);
      (rows[r] || (rows[r] = [])).push(win);
    });
    const rowH = rows.map((row) => Math.max(...row.map((w) => w.offsetHeight)));
    const gridH = rowH.reduce((a, b) => a + b + GAP, -GAP);
    const gridW = Math.min(cols, wins.length) * (W + GAP) - GAP;

    // center the block; if it's taller than the canvas, start at the top edge
    const x0 = Math.max(GAP, Math.round((cw - gridW) / 2));
    const y0 = gridH < ch ? Math.round((ch - gridH) / 2) : GAP;

    let y = y0;
    rows.forEach((row, r) => {
      const rowW = row.length * (W + GAP) - GAP;
      // last row keeps the same left edge as the full rows above it
      const rx = row.length === cols ? x0 : Math.max(GAP, Math.round((cw - rowW) / 2));
      row.forEach((win, c) => {
        win.style.left = rx + c * (W + GAP) + "px";
        win.style.top = y + "px";
      });
      y += rowH[r] + GAP;
    });
  }

  /* Scatter — the opposite of tidy: scramble everything back out to random spots
     with a random tilt. Also makes each window a keeper. */
  function scatter() {
    const wins = [...canvas.querySelectorAll(".ic-window")];
    if (!wins.length) return;
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    wins.forEach((win) => {
      markTouched(win);
      tween(win);
      const w = win.offsetWidth, h = win.offsetHeight;
      win.style.left = Math.round(Math.random() * Math.max(1, cw - w)) + "px";
      win.style.top = Math.round(Math.random() * Math.max(1, ch - h)) + "px";
      const deg = (Math.random() * 2 - 1) * 14;
      win.style.transform = "rotate(" + deg + "deg)";
      win.dataset.rotation = deg;
      win.style.zIndex = topZ() + 1;
    });
  }

  /* ---------- WHEEL ("deck"): a slow-turning ring of images ----------
     No windows here: the ring takes over the canvas on a dark stage. Every tile
     owns a fixed angle on a tilted ellipse; one shared rotation moves them all,
     and a fake perspective (nearer = bigger, brighter, on top) sells the depth.
     As it turns, whichever tile is furthest back quietly swaps in the next scrap
     from the channel, so the wheel keeps streaming instead of looping. */
  const prefersReducedMotion = () =>
    !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Place ONE tile for the ring's current rotation. Called for every tile on
  // every animation frame — this constant re-placing is what makes it spin.
  function layoutTile(t) {
    const m = deckMeta;
    // the tile's own angle plus the shared rotation; every tile shares deckRot,
    // so they all travel together
    const phi = t.phi + deckRot;
    // cos/sin trace a circle; a (wide) and b (short) squash it into an ellipse
    const lx = m.a * Math.cos(phi), ly = m.b * Math.sin(phi);
    // rotate that point by the tilt, then offset from the canvas centre
    const x = m.cx + lx * m.cosT - ly * m.sinT;
    const y = m.cy + lx * m.sinT + ly * m.cosT;
    // depth: 0 = far side of the ring, 1 = nearest. Drives the perspective.
    const depth = (Math.sin(phi) + 1) / 2;
    // ease the hover "pop" toward its target a little each frame
    t.boost += ((t.hot ? 1 : 0) - t.boost) * 0.2;
    const s = (DECK_SCALE_MIN + (DECK_SCALE_MAX - DECK_SCALE_MIN) * depth) * (1 + 0.18 * t.boost);
    // position, centre-align and scale in one transform (cheap for the GPU)
    t.el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%) scale(" + s + ")";
    t.el.style.zIndex = t.hot ? 100000 : Math.round(depth * 1000);
    t.el.style.opacity = (0.72 + 0.28 * depth).toFixed(3);   // far tiles sit back
  }

  // Build the ring: make the tiles, space them evenly, then start it turning.
  function buildDeck() {
    destroyDeck();                       // never leave a second ring behind
    if (!pool.length) return;
    deck = el("div", { class: "ic-deck" });
    canvas.append(deck);
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    const N = Math.min(deckCount, Math.max(6, pool.length));
    // a = half the ellipse's width, b = half its height (deckFlat flattens it)
    const a = Math.min(cw, ch) * 0.46, b = a * deckFlat;
    // cache the geometry (and cos/sin of the tilt) so layoutTile isn't
    // recomputing them for every tile 60 times a second
    deckMeta = { cx: cw / 2, cy: ch / 2, a, b, N, cosT: Math.cos(deckTilt), sinT: Math.sin(deckTilt) };
    deckTiles = []; deckRot = 0; deckNextImg = 0; deckSwapAcc = 0;
    for (let i = 0; i < N; i++) {
      const tile = el("div", { class: "ic-deck-tile" });
      tile.style.width = deckTileSize + "px";
      const img = el("img", { alt: "", loading: "lazy", draggable: "false" });
      const idx = deckNextImg % pool.length;   // pool is newest-first
      img.src = pool[idx].url;
      tile.dataset.poolIndex = idx;             // which scrap this is showing
      deckNextImg++;
      tile.append(img);
      // tile i sits at i/N of the way around the circle
      const t = { el: tile, img, phi: (i / N) * Math.PI * 2, hot: false, boost: 0 };
      tile.addEventListener("click", (e) => { e.stopPropagation(); openLightbox(parseInt(tile.dataset.poolIndex)); });
      tile.addEventListener("mouseenter", () => { t.hot = true; });   // pops via layoutTile; the ring keeps turning
      tile.addEventListener("mouseleave", () => { t.hot = false; });
      layoutTile(t);                            // starting position
      deck.append(tile);
      deckTiles.push(t);
    }
    requestAnimationFrame(() => deck && deck.classList.add("in"));  // fade the stage in
    if (!prefersReducedMotion()) startDeckLoop();                   // otherwise leave it parked
  }

  // The animation loop: advance one shared angle, re-draw every tile, repeat.
  function startDeckLoop() {
    cancelAnimationFrame(deckRAF);        // never run two loops at once
    let last = performance.now();
    const tick = (now) => {
      // dt = ms since the last frame, capped so a backgrounded tab doesn't
      // resume with one huge jump. Using dt keeps the speed frame-rate independent.
      const dt = Math.min(64, now - last); last = now;
      if (deckMeta) {
        deckRot -= (deckSpeed * dt) / 1000;   // subtract = counter-clockwise
        if (deckSpeed > 0) {
          // every time the ring turns by one tile's worth of angle, retire the
          // rear tile and give it a fresh scrap
          const slot = ((2 * Math.PI) / deckMeta.N) / deckSpeed * 1000;   // ms per image
          deckSwapAcc += dt;
          if (deckSwapAcc >= slot) { deckSwapAcc -= slot; swapBackTile(); }
        }
        deckTiles.forEach(layoutTile);
      }
      deckRAF = requestAnimationFrame(tick);
    };
    deckRAF = requestAnimationFrame(tick);
  }

  // Whichever tile is furthest back gets the next image in the channel — the
  // swap happens out of sight, so the ring never looks like a fixed set looping.
  function swapBackTile() {
    let back = null, min = 2;             // sin() maxes out at 1, so 2 is a safe start
    deckTiles.forEach((t) => { const d = Math.sin(t.phi + deckRot); if (d < min) { min = d; back = t; } });
    if (back) {
      const idx = deckNextImg % pool.length;
      back.img.src = pool[idx].url;
      back.el.dataset.poolIndex = idx;
      deckNextImg++;
    }
  }

  // Tear the ring down: stop the loop, drop the elements. Used when leaving
  // wheel mode and before every rebuild.
  function destroyDeck() {
    cancelAnimationFrame(deckRAF); deckRAF = 0;
    if (deck) { deck.remove(); deck = null; }
    deckTiles = []; deckMeta = null;
  }

  /* The ellipse is sized from the canvas, so a window resize has to re-measure
     it. Rebuild (debounced) and put the rotation back where it was, so the wheel
     doesn't visibly snap. */
  let deckResizeTO = null;
  window.addEventListener("resize", () => {
    if (MODE !== "deck" || !deckMeta) return;
    clearTimeout(deckResizeTO);
    deckResizeTO = setTimeout(() => {
      if (MODE !== "deck") return;
      const r = deckRot;
      buildDeck();
      deckRot = r;
    }, 150);
  });

  /* ---------- full-screen viewer (wheel mode) ----------
     Clicking a tile opens the scrap at full size; arrows walk the channel and
     Esc closes. Built once, on first use. */
  function buildLightbox() {
    lb = el("div", { class: "ic-lightbox", "aria-hidden": "true" });
    const img = el("img", { class: "ic-lb-img", alt: "" });
    const cap = el("figcaption", { class: "ic-lb-cap" });
    const fig = el("figure", { class: "ic-lb-figure" }, img, cap);
    const close = el("button", { class: "ic-lb-close", "aria-label": "Close" }, "✕");
    const prev = el("button", { class: "ic-lb-nav ic-lb-prev", "aria-label": "Previous" }, "‹");
    const next = el("button", { class: "ic-lb-nav ic-lb-next", "aria-label": "Next" }, "›");
    lb.append(close, prev, next, fig);
    document.body.append(lb);
    close.addEventListener("click", (e) => { e.stopPropagation(); closeLightbox(); });
    prev.addEventListener("click", (e) => { e.stopPropagation(); lbShow(lbIdx - 1); });
    next.addEventListener("click", (e) => { e.stopPropagation(); lbShow(lbIdx + 1); });
    // clicking the backdrop (or the empty space around the image) closes it
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("ic-lb-figure")) closeLightbox(); });
  }
  function lbShow(i) {
    lbIdx = (i + pool.length) % pool.length;   // wraps at both ends
    lb.querySelector(".ic-lb-img").src = pool[lbIdx].url;
    lb.querySelector(".ic-lb-cap").textContent = pool[lbIdx].filename || "";
  }
  function openLightbox(i) {
    if (!lb) buildLightbox();
    lbShow(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    if (lb) { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
  }
  const lbOpen = () => !!(lb && lb.classList.contains("open"));

  // --- drag (grab anywhere except the control handles) ---
  function makeDraggable(win) {
    let dragging = false, lastX = 0, lastY = 0;
    const onDown = (e) => {
      const t = e.target;
      if (t.closest(".ic-resize") || t.closest(".ic-rotate") || t.closest(".ic-close")) return;
      e.preventDefault();
      dragging = true;
      interacting = true;
      markTouched(win);
      bringFront(win);
      const p = e.touches ? e.touches[0] : e;
      lastX = p.clientX; lastY = p.clientY;
    };
    const onMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      win.style.left = (parseInt(win.style.left) || 0) + (p.clientX - lastX) + "px";
      win.style.top = (parseInt(win.style.top) || 0) + (p.clientY - lastY) + "px";
      lastX = p.clientX; lastY = p.clientY;
    };
    const onUp = () => { if (dragging) { dragging = false; interacting = false; } };
    win.addEventListener("mousedown", onDown);
    win.addEventListener("touchstart", onDown, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
  }

  // --- resize from the bottom-right grip ---
  function makeResizable(win, img) {
    const grip = win.querySelector(".ic-resize");
    let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;
    const onDown = (e) => {
      e.preventDefault(); e.stopPropagation();
      resizing = true;
      interacting = true;
      markTouched(win);
      const p = e.touches ? e.touches[0] : e;
      sx = p.clientX; sy = p.clientY;
      sw = win.offsetWidth; sh = win.offsetHeight;
      bringFront(win);
    };
    const onMove = (e) => {
      if (!resizing) return;
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      const nw = sw + (p.clientX - sx), nh = sh + (p.clientY - sy);
      if (nw > 100) win.style.width = nw + "px";
      if (nh > 80) win.style.height = nh + "px";
    };
    const onUp = () => { if (resizing) { resizing = false; interacting = false; } };
    grip.addEventListener("mousedown", onDown);
    grip.addEventListener("touchstart", onDown, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
  }

  // --- rotate by dragging the ⟲ handle around the window center ---
  function makeRotatable(win, handle) {
    let rotating = false, startAngle = 0, startRot = 0;
    const centre = () => {
      const r = win.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };
    const onDown = (e) => {
      e.preventDefault(); e.stopPropagation();
      rotating = true;
      interacting = true;
      markTouched(win);
      bringFront(win);
      const p = e.touches ? e.touches[0] : e;
      const [cx, cy] = centre();
      startAngle = Math.atan2(p.clientY - cy, p.clientX - cx);
      startRot = parseFloat(win.dataset.rotation) || 0;
    };
    const onMove = (e) => {
      if (!rotating) return;
      e.preventDefault();
      const p = e.touches ? e.touches[0] : e;
      const [cx, cy] = centre();
      const ang = Math.atan2(p.clientY - cy, p.clientX - cx);
      const deg = startRot + (ang - startAngle) * (180 / Math.PI);
      win.style.transform = "rotate(" + deg + "deg)";
      win.dataset.rotation = deg;
    };
    const onUp = () => { if (rotating) { rotating = false; interacting = false; } };
    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
  }

  // --- board mode: auto-drop loop ---
  function startAuto() {
    if (!AUTO_INTERVAL || autoTimer) return;
    autoTimer = setInterval(() => {
      if (MODE !== "board") { stopAuto(); return; }
      if (MAX_AUTO && autoCount >= MAX_AUTO) { stopAuto(); return; }
      if (!dropImage()) { stopAuto(); return; }
      autoCount++;
    }, AUTO_INTERVAL);
  }
  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }

  // board mode kick-off: drop one, then let the auto loop run
  function startBoard(delay) {
    if (!pool.length) return;
    setTimeout(() => {
      if (MODE !== "board") return;
      dropImage(); autoCount++;
      startAuto();
    }, delay ?? INITIAL_DELAY);
  }

  // --- fetch the whole channel, newest first ---
  async function load() {
    try {
      let all = [], page = 1, total = 0;
      while (true) {
        const res = await fetch(
          `https://api.are.na/v2/channels/${slug}?per=100&page=${page}&_=${Date.now()}${Math.random()}`,
          { cache: "no-store", headers: { "Cache-Control": "no-cache" } }
        );
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (page === 1) total = data.length || 0;
        const contents = data.contents || [];
        all = all.concat(contents);
        if (contents.length < 100 || (total && all.length >= total)) break;
        page++;
      }
      // Newest first. Are.na uses `connected_at` for when a block was added to
      // the channel; fall back to added_to_at/created_at for safety.
      const when = (b) => new Date(b.connected_at || b.added_to_at || b.created_at || 0);
      all.sort((a, b) => when(b) - when(a));
      pool = all
        .filter((b) => b.class === "Image" && b.image)
        .map((b) => ({
          url: (b.image.large || b.image.display || b.image.original).url,
          filename: b.title || b.image.filename || "scrap.jpg",
        }));

      if (!pool.length) { status.textContent = "No image scraps found."; return; }
      initGuaranteed();
      status.textContent = "";
      updateHint();

      // Board mode auto-runs, the wheel builds its ring, trail waits for the cursor.
      if (MODE === "board") startBoard();
      else if (MODE === "deck") buildDeck();
    } catch (err) {
      status.textContent = "Couldn't load Are.na channel “" + slug + ".”";
    }
  }

  // --- cursor trail: reveal images along the pointer's path ---
  let lastTX = null, lastTY = null;
  function trailMove(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    if (MODE !== "trail" || !pool.length || interacting) { lastTX = x; lastTY = y; return; }
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    if (lastTX == null) { lastTX = x; lastTY = y; return; }
    if (Math.hypot(x - lastTX, y - lastTY) >= TRAIL_DISTANCE) {
      dropImage({ x, y, trail: true });
      lastTX = x; lastTY = y;
    }
  }
  canvas.addEventListener("mousemove", (e) => trailMove(e.clientX, e.clientY));
  canvas.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) trailMove(t.clientX, t.clientY);
  }, { passive: true });

  /* --- triggers: click the empty canvas to add a keeper, Space to add, G/S to
     arrange, C to clear. The add button is gone on purpose — clicking the board
     is the add. In board mode the scrap lands somewhere random rather than under
     the cursor; trail mode still places at the cursor, since that mode is all
     about the pointer's path. Wheel mode opts out entirely: its tiles handle
     their own clicks (they open the full-screen view). */
  canvas.addEventListener("click", (e) => {
    if (MODE === "deck") return;
    if (e.target.closest(".ic-window") || e.target.closest(".ic-toggle") || e.target.closest(".ic-actions")) return;
    if (!pool.length) return;
    if (MODE === "board") { dropImage(); return; } // random spot (no coords)
    const r = canvas.getBoundingClientRect();
    dropImage({ x: e.clientX - r.left, y: e.clientY - r.top }); // permanent (no trail flag)
  });
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("info-canvas")) return;
    // while the full-screen view is open the arrows walk it and Esc closes it
    if (lbOpen()) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
      else if (e.key === "ArrowRight") lbShow(lbIdx + 1);
      return;
    }
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    // add / scatter / clear act on windows, so the wheel ignores them; G
    // reshuffles its ring instead of tidying a grid.
    const wheel = MODE === "deck";
    if (e.code === "Space" || e.key === " ") { if (!wheel) { e.preventDefault(); dropImage(); } }
    else if (k === "c") { if (!wheel) clearAll(); }
    else if (k === "t") { cycleMode(); }
    else if (k === "g") { wheel ? buildDeck() : tidyUp(); }
    else if (k === "s") { if (!wheel) scatter(); }
  });

  load();
}

/* ---------- private (locked) project placeholder ----------
   A project marked `private: true` still shows on the grid and opens its page,
   but the right column is a blurred, dark-gradient placeholder with a
   "contact to view" message instead of the real work. The left info column
   renders normally. */
function renderPrivatePlaceholder(p) {
  const mount = document.getElementById("detail");
  document.title = SITE.name + " — " + p.title;

  mount.append(el("a", { class: "back", href: "/" }, "← WORK"));

  const lock = el("div", { class: "private-lock" });
  // Optional blurred backdrop from the project's cover (if one is set).
  if (p.cover) {
    const bg = el("div", { class: "private-bg" });
    bg.style.backgroundImage = `url("${p.cover}")`;
    lock.append(bg);
  }
  lock.append(
    el("div", { class: "private-msg" }, p.privateMessage || "Contact to view.")
  );
  mount.append(lock);
}

/* Render a project page (private placeholder when the project is locked). */
function initProjectPage() {
  const detail = document.getElementById("detail");
  if (!detail) return; // not a project page
  const p = currentProject();
  renderProjectInfo();
  if (p.private) {
    renderPrivatePlaceholder(p);
    return;
  }
  renderDetail();
  initLightbox();
}

/* ---------- lightbox for project-page photos ---------- */
function initLightbox() {
  const detail = document.getElementById("detail");
  if (!detail) return;
  const imgs = Array.from(detail.querySelectorAll("img.media"));
  if (!imgs.length) return;

  const p = currentProject();
  const bg = p.lightboxBg || SITE.lightbox?.bg || "rgb(191, 132, 72)";
  const captionColor = p.lightboxCaption || SITE.lightbox?.caption || "#1a1a1a";

  // build the overlay once
  const overlay = el("div", { class: "lightbox", "aria-hidden": "true" });
  overlay.style.background = bg;
  const closeBtn = el("button", { class: "lb-close", "aria-label": "Close" }, "✕");
  const prevBtn = el("button", { class: "lb-nav lb-prev", "aria-label": "Previous" }, "‹");
  const nextBtn = el("button", { class: "lb-nav lb-next", "aria-label": "Next" }, "›");
  const figure = el("figure", { class: "lb-figure" });
  const img = el("img", { class: "lb-img", alt: "" });
  const cap = el("figcaption", { class: "lb-cap" });
  cap.style.color = captionColor;
  figure.append(img, cap);
  overlay.append(closeBtn, prevBtn, nextBtn, figure);
  document.body.append(overlay);

  let idx = 0;
  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    const src = imgs[idx].currentSrc || imgs[idx].src;
    const alt = imgs[idx].getAttribute("alt") || "";
    img.src = src;
    img.alt = alt;
    cap.textContent = alt;
    cap.style.display = alt ? "" : "none";
  };
  const open = (i) => {
    show(i);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  // hide arrows if there's only one photo
  if (imgs.length < 2) { prevBtn.style.display = "none"; nextBtn.style.display = "none"; }

  imgs.forEach((im, i) => {
    im.style.cursor = "zoom-in";
    im.addEventListener("click", () => open(i));
  });
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
  // click on empty backdrop (not the image) closes
  overlay.addEventListener("click", (e) => { if (e.target === overlay || e.target === figure) close(); });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
}

/* ---------- project detail page (main column) ---------- */
function renderDetail() {
  const mount = document.getElementById("detail");
  if (!mount) return;
  const p = currentProject();
  document.title = SITE.name + " — " + p.title;

  mount.append(el("a", { class: "back", href: "/" }, "← WORK"));
  // Title is shown in the sidebar, not repeated here in the main column.

  // Short intro/overview above the hero (HTML allowed — can include links).
  if (p.intro) mount.append(el("p", { class: "proj-intro", html: p.intro }));

  if (p.content?.length) {
    // Flat content: a list of blocks, each either text or images. No headings.
    //   "some text"                         → a paragraph (or use { text })
    //   { text: "…" } | { text: ["…","…"] } → paragraph(s), HTML/links allowed
    //   { images: [...], grid: 1|2|3 }      → an image row (grid = columns)
    // grid defaults to the number of images (1→full, 2→2-up, 3+→3-up).
    p.content.forEach((block) => {
      if (typeof block === "string") {
        mount.append(el("div", { class: "content-text" }, el("p", { html: block })));
        return;
      }
      if (block.heading) {
        mount.append(el("h2", { class: "content-heading" }, block.heading));
      }
      if (block.text != null) {
        const texts = Array.isArray(block.text) ? block.text : [block.text];
        const wrap = el("div", { class: "content-text" });
        texts.forEach((t) => wrap.append(el("p", { html: t })));
        mount.append(wrap);
      }
      if (block.images?.length) {
        const cols = block.grid || Math.min(block.images.length, 3);
        const layout = cols >= 3 ? "grid-3" : cols === 2 ? "grid-2" : "full";
        // block.ratio (e.g. "16/9") sets a fixed crop box for the images.
        const med = el("div", { class: "media-rows media-" + layout + (block.ratio ? " media-ratio" : "") });
        if (block.ratio) med.style.setProperty("--cell-ratio", String(block.ratio).replace(":", "/"));
        appendMedia(med, block.images, p.title);
        mount.append(med);
      }
      if (block.embed) {
        // { embed: "https://youtube.com/..." | vimeo | embed url } → responsive player
        const wrap = el("div", { class: "content-embed" });
        wrap.append(
          el("iframe", {
            src: toEmbedUrl(block.embed),
            title: p.title + " video",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            // required by YouTube — without it the player fails with "error 153"
            referrerpolicy: "strict-origin-when-cross-origin",
            allowfullscreen: "",
            loading: "lazy",
          })
        );
        mount.append(wrap);
      }
    });
  } else if (p.sections?.length) {
    // Section-based layout: heading + copy + grouped images, in order.
    p.sections.forEach((s) => {
      const sec = el("section", { class: "proj-section" + (s.bg === "dark" ? " dark" : "") });
      if (s.heading) sec.append(el("h2", { class: "section-heading" }, s.heading));
      (s.text || []).forEach((t) => sec.append(el("p", { html: t })));
      if (s.images?.length) {
        // layout: "full" (default, stacked) | "grid-2" | "grid-3"
        const med = el("div", { class: "media-rows media-" + (s.layout || "full") });
        appendMedia(med, s.images, p.title);
        sec.append(med);
      }
      mount.append(sec);
    });
  } else {
    // Default: all images stacked down the page, then the write-up.
    const rows = el("div", { class: "media-rows" });
    appendMedia(rows, p.images || [], p.title);
    mount.append(rows);

    const body = el("div", { class: "body" });
    (p.body || []).forEach((para) => body.append(el("p", {}, para)));
    mount.append(body);
  }
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTopbar(document.body.dataset.page || "");
  renderSubhead();
  syncStackHeight();
  initResizer();
  renderArena();
  renderGrid();
  renderInfo();
  renderLandingLinks();
  renderInfoCanvas();
  initProjectPage();
  window.addEventListener("resize", syncStackHeight);
  window.addEventListener("load", syncStackHeight);
});
