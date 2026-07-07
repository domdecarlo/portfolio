/* ============================================================
   SITE CONFIG + CONTENT
   Edit this one file to change everything on the site:
   header/nav, Info page, Are.na feed, lightbox, and all projects.
   ============================================================ */

/* Templates
   PROJECTS
   Each project is a grid tile on the home page and a page at
   project.html?id=<id>.

   Core fields:
     id      unique, lowercase, no spaces
     title   project name
     year    shown on the grid tile
     tags    disciplines, shown on the grid tile
     cover   grid-tile image (fallback when `images` is empty)
     images  grid-tile carousel media (img or video)

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
   (.mp4/.webm/.mov) both work; images open in the lightbox. `embed` takes a
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


const SITE = {
  name: "Dominic Decarlo",
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
    //{ label: "Work", href: "index.html" },
    { label: "INFO", href: "info.html" },
    {
      label: "MORE",
      children: [
        { label: "Scrap", href: "scraps.html" },
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
      "Hi, I'm Dominic Decarlo, a Visual Designer & Illustrator based in San Francisco.",
      "Focused on creating impressive brand experiences with visual impact.",
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

  // ---- INFO CANVAS (right column of the Info page) ----
  // An interactive image board that pulls the newest scraps from the Are.na
  // channel above. Two modes, switchable with the on-canvas toggle (the
  // visitor's choice is remembered):
  //   "trail"  — images reveal along the cursor's path and fade as new ones
  //              arrive; anything you grab becomes a permanent keeper.
  //   "board"  — the original: click / Space / auto-drop into random spots.
  // Every image is a draggable / resizable / rotatable / closeable window.
  infoCanvas: {
    enabled: true,
    channelSlug: "scrap-k6m8xpubrkg", // defaults to arena.channelSlug if omitted
    mode: "trail",       // starting mode on desktop: "trail" or "board"
    mobileMode: "board", // starting mode on mobile/touch (trail needs a cursor)
    showToggle: true,    // show the on-canvas Trail/Board switch

    guaranteedNew: 15,   // reveal the newest N scraps first (in shuffled order)

    // trail mode
    trailDistance: 90,   // px of cursor travel between reveals (smaller = denser)
    trailMax: 22,        // max ambient (untouched) images before the oldest fades

    // board mode
    initialDelay: 2500,  // ms before the board starts auto-dropping
    autoInterval: 2200,  // ms between auto-dropped images (0 = click/Space only)
    maxAuto: 0,          // stop auto after N images (0 = until the pool runs out)

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
};

const PROJECTS = [
  /* ---------- SIDEBAR TEMPLATE (copy this block for a new project) ----------
  { // Project Name
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
  },
  --------------------------------------------------------------------------- */
  { // Strava
    id: "strava",
    title: "Strava",
    year: "2024-",
    tags: "Brand Design",
    private: true, // locked placeholder — see gating notes above
    cover: "assets/img/strava/strava-1.jpg", // grid-tile image
    images: [
      "assets/img/strava/strava-1.jpg",
      "assets/img/strava/strava-screen-2.jpg",
      "assets/img/strava/strava-screen-3.jpg",
    ],

    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "Strava" },
      //{ text: "Brand, Visual, and Animation Design for Strava." },
      { label: "Year", value: "2023-now" },
      { label: "Discipline", value: "Brand Identity, Event Design, Animation" },
      { text: "Branding, Visual Design, and other work for <a href='https://strava.com/'>Strava.</a>." },
      { image: "assets/img/strava/sidebar/connected-movement.jpg", caption: "Connected in movement." },
      //{ image: "assets/img/strava/sidebar/go-outside.jpg", caption: "I think this is what it's all about." },
      { text: "Creating for Strava means creating for millions of active people all over the world." },
        { heading: "The worlds biggest team." },
      { text: "At Strava I work across brand and product design - this means I develop brand identity, GTM campaigns, event design, and product experiences. I do a bit of everything! But to put it succintly I help shape how the brand looks and moves in the world." },
      { text: "We help shape the experience for the community of active movers. Every kudos given, activity recording and achievement belongs to a real person, with a unified goal that brings us all together into one enormous team." },
      { image: "assets/img/strava/sidebar/kudo-animated.mp4", caption: "How it feels to give a 'Kudos'." },
        { heading: "What I love about moving." },
      { text: "Strava is here to motivate people to live their best active lives and to connect the community that moves. I'm a part of the community. I like to bike, and I know how good it feels to put in an effort and share it. It can be kind of sport or activity, bike enlightenment, run, walk, climb. It doesn't matter - It's about connecting with those around you, sharing in the movement and encouraging your community to participate. " },
      { text: "That's the feeling I chase in the work. I want design that solves problems, that makes it easier to connect, to share, and to inspire. That feeling of being human is about honesty, generousity, and getting a little bit sweaty. It's better when it's shared. It's less about polish for its own sake and more about celebrating effort — whoever's putting it in — and creating something that makes people want to connect with their community." },
      { image: "assets/img/strava/sidebar/strava-activity-card.png", caption: "<a href='https://www.strava.com/athletes/140234296'>I love being on a bicycle, please click and see.</a>" },
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/strava/strava-1.jpg"] },
    ],
  },

  { // Solv
    id: "solv",                 // unique, lowercase, no spaces
    title: "Solv Health",
    year: "2022-2023",
    tags: "Brand Design, Illustration",   // shown on the home grid tile
    cover: "assets/img/solv/solv-1.jpg",
    lightboxBg: "#000000" ,
    lightboxCaption: "#FFFFFF",
    images: [ // grid-tile carousel
             "assets/img/solv/Solv-logo-multicolor_crunchberrybackground.gif", "assets/img/solv/solv-1.jpg",
             "assets/img/solv/solv-23.jpg",
            ],
    // SIDEBAR — default structure (renders top-to-bottom exactly as listed).
    sidebar: [
      { title: "Project Title" },
      { text: "Branding redesign, website development and illustration system development for <a href='https://solvhealth.com/'>Solv Health</a>, a healthcare software startup, empowering consumers to simplify their day-to-day healthcare needs." },
      { label: "Year", value: "2022-2023" },
      { label: "Discipline", value: "Brand Identity, Animation, Event Design" },
      { image: "assets/img/solv/sidebar/together.jpg", caption: "Lend a hand, we're in it for the long haul." },
      { text: "I led the brand redesign, website, and created an illustration system for Solv Health, a company built to make same-day, walk-in healthcare as easy to book as a restaurant table. That meant developing the existing brand and finding ways to improve our visual language. I moved direction of the brand into a more comforting experience, both in the product experience and consumer visuals - ensuring it felt less like insurance paperwork and more like someone lending you a hand in your time of need." },

      { image: "assets/img/solv/sidebar/healthouch.jpeg", caption: "A system eating itself." },
      { heading: "Why it matters" },
      { text: "Healthcare is one of the last places consumer technology hasn't caught up to consumer expectations. Most people can order virtually any product in seconds, but booking a doctor still means calling around, maybe waiting weeks and guessing what it'll cost at the end. Solv's whole premise is that convenient care already exists, it's just hard to find and harder to trust. My job was to make that trust visible - nothing dressed up to look more complicated than it is. Good design in healthcare isn't about looking clinical - It's about getting out of the way and comforting hte user so someone can make a decision fast with accurate information." },
    ],

    // MAIN COLUMN — flat content blocks (text + image rows, grid 1|2|3)
    content: [
      
      { images: ["assets/img/solv/solv-1.jpg"] },
      { images: ["assets/img/solv/solv-2.jpg", "assets/img/solv/solv-3.jpg"], ratio: "1.91:1" },
      { images: ["assets/img/solv/solv-13.jpg", "assets/img/solv/solv-14.jpg", "assets/img/solv/solv-15.jpg"], ratio: "1.91:1" },
      // Outside video (YouTube or Vimeo link — normalized to a player automatically).
      { embed: "https://player.vimeo.com/video/780826718" },
      
      { heading: "Illustration System" },
      { images: ["assets/img/solv/solv-7.jpg", "assets/img/solv/solv-8.jpg"], ratio: "1.91:1" },
      { images: ["assets/img/solv/solv-4.jpg", "assets/img/solv/solv-5.jpg", "assets/img/solv/solv-6.jpg"], ratio: "1.91:1" },
      { images: ["assets/img/solv/solv-9.jpg", "assets/img/solv/solv-10.jpg", "assets/img/solv/solv-11.jpg"], ratio: "1.91:1" },

      { heading: "Product Design" },
      { images: ["assets/img/solv/solv-19.jpg", "assets/img/solv/solv-20.jpg"], ratio: "1.91:1" },
      { images: ["assets/img/solv/solv-21.jpg", "assets/img/solv/solv-22.jpg"], ratio: "1.91:1" },

      { heading: "Event Design" },
      { images: ["assets/img/solv/solv-12.jpg"] },
      { images: ["assets/img/solv/solv-24.jpg", "assets/img/solv/solv-25.jpg"], ratio: "1.91:1" },
      

    ],
  },
  
  { // Lam Family SF State
  id: "sfstate",
  title: "Lam Family College of Business",
  year: "2019-2021",
  tags: "BRAND DESIGN",
  private: false, // locked placeholder — see gating notes above
  cover: "assets/img/sfstate/sfstate-1.jpg", // grid-tile image
  images: [
    "assets/img/sfstate/sfstate-1.jpg", 
    "assets/img/sfstate/sfstate-12.jpg",
    "assets/img/sfstate/sfstate-1-animated.gif", 
  ],

  // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
  // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
  //            | { image, caption? } | { video, caption?, controls? }
  //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
  //          add controls: true for a play/pause bar instead of autoplay.
  //          (An .mp4 in an `image` field also plays as video.)
  sidebar: [
    { title: "Lam Family College of Business" },
    //{ text: "Brand, Visual, and Animation Design for Strava." },
    { label: "Year", value: "2019-2021" },
    { label: "Discipline", value: "Brand Identity, Event Design" },
      { image: "assets/img/sfstate/sidebar/learning.jpg", caption: "Living is learning" },
      { text: "Branding, Visual Design, Web Design and other work for <a href='https://cob.sfsu.edu/'>The Lam Family College of Business.</a>." },
      { text: "The Lam Family College of Business at San Francisco State is a leading institution of business education in the San Francisco Bay Area, with an emphasis on preparing students to succeed in a global economy and interconnected world. Our commitment to sustainable business, diversity, social justice and global partnerships echoes our core philosophy of responsible leadership. As one of the top-ranked public universities, we have been recognized worldwide for our investments in diversity, social responsibility, and visionary academics." },
    { heading: "Urban Education" },
      { text: "I defined art direction for how the college showed up: in print, on screens, and everywhere in between. I built the marketing collateral, the website, the presentations, the illustrations, and the ads, unifying it under one creative voice. A lot of the job was translation: taking what marketing needed and turning it into something I could build out within out frameworks, without losing the idea in the handoff. I owned the design and UX of cob.sfsu.edu and all associated sites."},
      { image: "assets/img/sfstate/sidebar/sfstate-commencement-1911.jpg", caption: "It's all love.", },
    { heading: "What I love about the school." },
      { text: "SF State is a public university in the middle of a city, built for people who don't take access for granted. Many students here are the first in their family to go to college, and the school takes that seriously instead of treating it as a footnote. I liked designing for that. Eliminating exclusivity and championing the equality of all in a city where money, technology and power are dominating its development. It's about solving for that problem, ensuring informationa and access is clear for anyone who walks in the door and understand what's being offered to them."},
  ],

  content: [
    // 1 image → full width
    { images: ["assets/img/sfstate/sfstate-1.jpg"] },

    { images: ["assets/img/sfstate/sfstate-1-animated.gif", "assets/img/sfstate/sfstate-1-a.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/sfstate/sfstate-2.jpg", "assets/img/sfstate/sfstate-3.jpg", "assets/img/sfstate/sfstate-4.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/sfstate/sfstate-8.jpg", "assets/img/sfstate/sfstate-9.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/sfstate/sfstate-10.jpg", "assets/img/sfstate/sfstate-11.jpg"], ratio: "1.91:1" },
    
    { heading: "Logos and Marks" },
    { images: ["assets/img/sfstate/sfstate-19.jpg", "assets/img/sfstate/sfstate-20.jpg", "assets/img/sfstate/sfstate-23.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/sfstate/sfstate-21.jpg", "assets/img/sfstate/sfstate-22.jpg", "assets/img/sfstate/sfstate-24.jpg"], ratio: "1.91:1" },

    { heading: "Advertisement" },
    { images: ["assets/img/sfstate/sfstate-12.jpg"] },
    { images: ["assets/img/sfstate/sfstate-25.jpg"] },
    { images: ["assets/img/sfstate/sfstate-13.jpg", "assets/img/sfstate/sfstate-14.jpg"], ratio: "1.91:1" },

    { heading: "Website Design" },
    { images: ["assets/img/sfstate/sfstate-15.jpg", "assets/img/sfstate/sfstate-16.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/sfstate/sfstate-17.jpg", "assets/img/sfstate/sfstate-18.jpg"], ratio: "1.91:1" },

  ],
  },

  { // newbabyironage
    id: "newbabyironage",
    title: "The Bitches Present 'New Baby Iron Age'",
    year: "2020",
    tags: "Brand Design, Illustration",
    private: false, // locked placeholder — see gating notes above
    cover: "assets/img/newbabyironage/newbabyironage-1.jpg", // grid-tile image
    lightboxBg: "#840075" ,
    lightboxCaption: "#FFFFFF",
    images: [
      "assets/img/newbabyironage/newbabyironage-2.jpg",
      "assets/img/newbabyironage/newbabyironage-1.jpg",
      "assets/img/newbabyironage/newbabyironage-13.jpg",
    ],

    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "The Bitches Present 'New Baby Iron Age'" },
      //{ text: "Brand, Visual, and Animation Design for Strava." },
      { label: "Year", value: "2020" },
      { label: "Discipline", value: "Brand Identity, Album Design" },
      { text: "Editorial and album design for <a href='https://thebitchespresent.bandcamp.com/album/new-baby-iron-age/'>New Baby Iron Age.</a>" },
      { image: "assets/img/newbabyironage/sidebar/newbaby-sidebar-1.jpg", caption: "We wanted to present something." },
      //{ image: "assets/img/strava/sidebar/go-outside.jpg", caption: "I think this is what it's all about." },
      { text: "The New Baby Iron Age Deluxe Bundle includes 'The Bitches Present...Notes from a Scattered Mind' Broadsheet and New Baby Iron Age on vinyl. The 40 page broadsheet contains 66 incredible pictures, drawings by James Watts, poetry by Kyle Menschel and Saam Akbarkhanzadeh, and a brilliantly written history of the band. The record is a 2-disc double 180 gram thick vinyl housed in a heavy duty Japanese double gatefold cover." },
      {text: "For the release of their first album, The Bitches Present... wanted to create a small run of vinyls to distribute to friends and fans I designed this album with James Watts in 2020. The record is a 2-disc double 180 gram thick vinyl housed in a heavy duty Japanese double gatefold cover. The band wanted something that looked old, something that looked like the owner had used it a thousand times, covered it with stickers they found or made, lent to friends, forgotten about and then found again. Using images of the band during live performances i created stickers that looked aged and weathered, ripped in certain places and placed at random on the inside cover of the gatefold." },
        { heading: "A Band for you and me." },
      { text: "Here's a blurb about the band from the lead singer that describes them better than I ever could." },
      { image: "assets/img/newbabyironage/sidebar/newbaby-sidebar-2.jpg", caption: "Victor loves pedals." },
      { text: "<strong>The Bitches Present</strong> was a funk, jazz, fusion, spoken-word, jam band from San Francisco, California. We had 4 core members: Kyle, Victor, Saam, and Sina; and a rotational 5th spot that cemented with the ever-lovely Joey Natiello. Originally a classic garage-style house-party-playing band, The Bitches Present grew into a cult favorite among the local San Francisco music scene. We played shows, hosted art events, threw parties. It was important for us to foster community and provide spaces where people could connect and share ideas. We read poetry, had live-paintings, audience-interactive discussions, even tacking on a cooking show to our performance. We were called The Bitches Present... because we wanted to present something, to offer a space with an experience larger than your average concert..." },
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/newbabyironage/newbabyironage-2.jpg"] },
      { images: ["assets/img/newbabyironage/newbabyironage-2a.jpg"] },
      { images: ["assets/img/newbabyironage/newbabyironage-5.jpg"] },
      { images: ["assets/img/newbabyironage/newbabyironage-6.jpg", "assets/img/newbabyironage/newbabyironage-7.jpg"], ratio: "16:9" },
      { images: ["assets/img/newbabyironage/newbabyironage-5.jpg", "assets/img/newbabyironage/newbabyironage-3.jpg"], ratio: "16:9" },
      { heading: "The Broadsheet"},
      { images: ["assets/img/newbabyironage/newbabyironage-8.jpg"] },
      { images: ["assets/img/newbabyironage/newbabyironage-9.jpg", "assets/img/newbabyironage/newbabyironage-10.jpg"], ratio: "1:1" },
      { images: ["assets/img/newbabyironage/newbabyironage-11.jpg", "assets/img/newbabyironage/newbabyironage-12.jpg"], ratio: "3:4" },
    ],
  },

  { // SSD
    id: "SSD",
    title: "Surveillance Self Defense",
    year: "2018",
    tags: "Brand Design",
    cover: "assets/img/ssd/ssd-1.jpg", // TODO: swap for a real cover image
    images: [
      "assets/img/ssd/ssd-1.jpg",
      "assets/img/ssd/ssd-10.jpg",
      "assets/img/ssd/ssd-8.jpg",
    ],
    
    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "Surveillance Self Defense" },
      { text: "Editorial and branding design for Surveillance Self-Defense." },
      { label: "Year", value: "2018" },
      { label: "Discipline", value: "Brand Identity, Branding" },
      //{ text: "The internet is under threat. Surveillance has become the norm. How can people protect themselves, and how do we build routes to privacy that are more accessible and easier to understand?" },
        { image: "assets/img/ssd/sidebar/surv-destroy.jpg", caption: "wow, lock me up." },
      { text: "Editorial and branding design for <a href='https://ssd.eff.org/'>Surveillance Self-Defense.</a>." },
      { text: "Cybersecurity isn’t a product you buy. It’s a habit you build.To counter a digital problem, this rebrand goes back to basics. It elevates real physical connection and information exchange as our ultimate line of defense." },
        { heading: "The Toolkit" },
      { text: "This project rebrands the EFF and introduces the Surveillance Self-Defense (SSD) Guide: a tactile toolkit of booklets, posters, and software built to get communities talking about digital rights. The core of the guide features two informational booklets mapping out safer habits for your personal and professional life online. Hand-printed on an RZ390 Risograph, the booklets pair actionable security strategies with large, illustrated spreads exposing global surveillance sites."},
        { image: "assets/img/ssd/sidebar/surv-response-Denis-Beaubois.jpg", caption: "<a href='https://www.onlineopen.org/surveillance-and-the-ludic-reappropriation-of-public-space'>Surveillance and the Ludic Reappropriation of Public Space</a>" },
        { heading: "Pass It On" },
      { text: "True security relies on the collective. Every SSD kit includes half-scale booklets designed to be passed directly to your peers.By leveraging this physical network, we empower everyday users to become privacy educators in their own circles. From interactive PGP encryption toolkits to bold graphic materials, we are making digital safety accessible to everyone. Protect your data. Share the knowledge. Ready to protect the network?"},
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/ssd/ssd-1.jpg"] },
      { images: ["assets/img/ssd/ssd-10.jpg"] },
     
      // 2 images → 2-up grid
      {images: [
          "assets/img/ssd/ssd-6.jpg",
          "assets/img/ssd/ssd-2.jpg",
        ],
      },

      {images: [
          "assets/img/ssd/ssd-4.jpg",
          "assets/img/ssd/ssd-7.jpg",
        ],
      },

      { images: ["assets/img/ssd/ssd-14.jpg"] },

      { images: ["assets/img/ssd/ssd-13.jpg"] },

      {images: [
          "assets/img/ssd/ssd-15.jpg",
          "assets/img/ssd/ssd-16.jpg",
        ],
      },

      {images: [
          "assets/img/ssd/ssd-17.jpg",
          "assets/img/ssd/ssd-18.jpg",
        ],
      },

      { images: ["assets/img/ssd/ssd-20.jpg"] },

    ],
  },

  { // Pena
    id: "Pena",
    title: "PEÑA",
    year: "Ongoing",
    tags: "Brand Design, Illustration, Animation",
    private: false, // locked placeholder — see gating notes above
    cover: "assets/img/pena/pena-1.jpg", // grid-tile image
    lightboxBg: "#840075" ,
    lightboxCaption: "#FFFFFF",
    images: [
      "assets/img/pena/pena-1.gif",
      "assets/img/pena/pena-3.jpg",
      "assets/img/pena/pena-5.jpg",
    ],

    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "PEÑA" },
      //{ text: "Brand, Visual, and Animation Design for Strava." },
      { label: "Year", value: "Ongoing" },
      { label: "Discipline", value: "Brand Identity, Album Design, Animation, Illustration" },
      { text: "Visual, merchandise and album design for <a href='https://nicopenya.bandcamp.com/'>PEÑA.</a>" },
      { image: "assets/img/pena/sidebar/pena-sidebar-2.jpg", caption: "" },
      //{ image: "assets/img/strava/sidebar/go-outside.jpg", caption: "I think this is what it's all about." },
      { text: "PEÑA is the dynamic musical project led by Nico Peña, a Chilean-American artist celebrated for his eclectic blend of influences and prolific output. Originally from New Jersey and now based in San Francisco, Nico’s music is a fusion of his East Coast roots and the vibrant cultural melting pot of his West Coast home." },
      { heading: "bedroom-bossa brainchild of a chilean-american first gen" },
      { text: "Here's a nice video of the band." },
      { embed: "https://youtu.be/6uHKzz4J9cw" }, // outside video (YouTube/Vimeo)
      { text: "Singing in both Spanish and English, his unique sound is a rich tapestry of genres, seamlessly weaving together Latin jazz rhythms, soulful vocals, introspective emo themes, sun-soaked surf rock vibes, the smooth allure of bossa nova, dreamy textures of shoegaze and the intimate, raw aesthetic of lo-fi pop." },
      { image: "assets/img/pena/sidebar/pena-sidebar-1.jpg", caption: "" },
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/pena/pena-1.gif"] },
      { images: ["assets/img/pena/pena-2.jpg", "assets/img/pena/pena-3.jpg"], ratio: "1:1" },
      { images: ["assets/img/pena/pena-4.jpg", "assets/img/pena/pena-5.jpg"], ratio: "1:1" },
      
      { images: ["assets/img/pena/pena-6.jpg"] },
      { images: ["assets/img/pena/pena-8.jpg", "assets/img/pena/pena-9.jpg"], ratio: "1:1" },

      { images: ["assets/img/pena/pena-13.jpg", "assets/img/pena/pena-14.jpg", "assets/img/pena/pena-15.jpg"], ratio: "1:1" },
      { images: ["assets/img/pena/pena-12.gif", "assets/img/pena/pena-11.gif"], ratio: "3:5" },
    ],
  },

  { // SF State Bold Thinking
  id: "sfstateboldthinking",
  title: "SF State Bold Thinking",
  year: "2018",
  tags: "BRAND DESIGN, WEB DESIGN",
  private: false, // locked placeholder — see gating notes above
  cover: "assets/img/boldthinking/sfstate-1.jpg", // grid-tile image
  lightboxBg: "#840075",
  lightboxCaption: "#FFFFFF",
  images: [
    "assets/img/boldthinking/boldthinking-1.jpg", 
    "assets/img/boldthinking/boldthinking-8.jpg", 
  ],

  // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
  // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
  //            | { image, caption? } | { video, caption?, controls? }
  //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
  //          add controls: true for a play/pause bar instead of autoplay.
  //          (An .mp4 in an `image` field also plays as video.)
  sidebar: [
    { title: "SFSU Bold Thinking" },
    //{ text: "Brand, Visual, and Animation Design for Strava." },
    { label: "Year", value: "2018" },
    { label: "Discipline", value: "Brand Identity, Web Design" },
      { image: "assets/img/boldthinking/sidebar/bold-sidebar-1.jpg", caption: "I seriously pitched using a version of this as a mascot." },
      { text: "Branding, Visual Design, Web Design and other work for <a href='https://develop.sfsu.edu/'>San Francisco State Universities Bold Thinking</a> initiatve." },
      { text: "Logo redesign, website and branding refresh for San Francisco State Universities Bold Thinking Campaign, bringing in funds from alumni and donors to support the various programs and initiatives at San Francisco State University. These assets were used to create adverts, clothing merchandise and fundraising collatoral supplied to alumni and donors at in-person and online events." },
    { heading: "Website Design" },
      { text: "Website design and rebranding for San Francisco State University. Built to highlight fundraising initiatives and give donors a centralized website for information and donation opportunities. I designed this site using Drupal and Bootstrap to create custom modules to work within the schools framework restrictions."},
      { text: "<a href='https://develop.sfsu.edu/'>See it in action here.</a>"},
  ],

  content: [
    // 1 image → full width
    { images: ["assets/img/boldthinking/boldthinking-1.jpg"] },
    { images: ["assets/img/boldthinking/boldthinking-2.jpg"] },
    { images: ["assets/img/boldthinking/boldthinking-4.jpg"] },

    { images: ["assets/img/boldthinking/boldthinking-5.jpg", "assets/img/boldthinking/boldthinking-6.jpg"], ratio: "1.91:1" },
    { images: ["assets/img/boldthinking/boldthinking-7.gif", "assets/img/boldthinking/boldthinking-8.jpg"], ratio: "1.91:1" },
  ],
  },

    { // AIP
    id: "aip",
    title: "AI Partnerships Corporation",
    year: "2020",
    tags: "Brand Design, Web Design",
    private: false, // locked placeholder — see gating notes above
    cover: "assets/img/aip/aip-1.jpg", // grid-tile image
    images: [
      "assets/img/aip/aip-3.gif",
      "assets/img/aip/aip-1.jpg",
      "assets/img/aip/aip-10.jpg",
    ],

    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "Ai Partnerships Corp" },
      //{ text: "Brand, Visual, and Animation Design for Strava." },
      { label: "Year", value: "2020" },
      { label: "Discipline", value: "Brand Identity, Web Design" },
      { text: "Branding, Web Design, and other work for <a href='https://www.aipartnershipscorp.com/'>AI Partnerships Corporation.</a>" },
      { image: "assets/img/aip/sidebar/aip-sidebar-2.jpg", caption: "Max Fleischer, The Robot, 1932." },
      //{ image: "assets/img/strava/sidebar/go-outside.jpg", caption: "I think this is what it's all about." },
      { text: "AI Partnership Corporation is the AI affiliate network." },
      
      { text: " It is a network of companies with AI-enabled solutions working together to help enterprises leverage AI to gain a competitive advantage. In the 80s, it was computing. In the 90s, we saw the advent of the internet. Now, as technology continues to exponentially grow, a new opportunity has risen. AI represents the next paradigm shift in technology. AIP recognizes this new revolution as an opportunity to establish a strong presence in the emerging AI markets. " },
      { image: "assets/img/aip/sidebar/aip-sidebar-1.gif", caption: "AIP offers you a rose, what do you do?" },
      { text: "AIP is establishing an Affiliate Network of solution integrators and we will provide them with resources required to successfully implement AI solutions for their clients in order to allow their clients to realize the cost savings and competitive advantages from implementing AI." },
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/aip/aip-1.jpg"] },
      { images: ["assets/img/aip/aip-4.jpg", "assets/img/aip/aip-5.jpg"], ratio: "1:1" },
      { images: ["assets/img/aip/aip-6.jpg", "assets/img/aip/aip-7.jpg"], ratio: "1:1" },

      { heading: "Website Design" },
        { text: "<a href='https://www.dominicdecarlo.com/aipartner/'>Initial landing page and website design for the AI Partnership Corporation.</a>"},
        { images: ["assets/img/aip/aip-8.jpg", "assets/img/aip/aip-9.jpg"], ratio: "1:1" },
        { images: ["assets/img/aip/aip-10.jpg", "assets/img/aip/aip-11.jpg"], ratio: "1:1" },
    ],
  },

  { // Waving
    id: "Waving",
    title: "Waving",
    year: "2017",
    tags: "Print Design",
    private: false, // locked placeholder — see gating notes above
    cover: "assets/img/waving/waving-1.jpg", // TODO: swap for a real cover image
    images: [
      "assets/img/waving/waving-1.jpg",
      "assets/img/waving/waving-2.jpg",
      "assets/img/waving/waving-3.jpg",
    ],
    
    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "Waving" },
      { text: "5.5x8.5in 56page saddle-bound booklet" },
      { label: "Year", value: "2018" },
      { label: "Discipline", value: "Print Design" },
      //{ text: "The internet is under threat. Surveillance has become the norm. How can people protect themselves, and how do we build routes to privacy that are more accessible and easier to understand?" },
        { embed: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Amrita_Vidyalayam_children_waving.webm", caption: "a wave means community." },
      { text: "The waving of the hand is a nonverbal gesture that has an unclear origin but is said to have dated back to as far as the 18th century however, it was neither called waving, nor was it used as saying hello, or goodbye. It's used to show others that they are not armed with weapons and do not pose a threat." },
      { heading: "Components" },
      { text: "The waving of the hand has multiple variables and styles of performing the gesture. The common waving of the hand to mean 'hello' or 'goodbye' is done by moving the hand side to side, however there are more than one form of waving; each form having its own meaning." },
      { text: "Waving has four variables which include: 1. the open palm (is the palm curved or straight), 2.the angle of the wave (big waves or short waves), 3.the elevation of the hand (above the head or low), 4. and the movement pattern of the wave (sideways rotation, up and down motion, side to side motion)."},
        { image: "assets/img/waving/sidebar/waving-garf.gif", caption: "Wishing you a happy monday. Let's 'try' shall we?" },
      { text: "There are many ways of waving goodbye: Americans face the palm outward and move the hand side to side, Italians face the palm inward and move the fingers facing the other person, French and Germans face the hand horizontal and move the fingers toward the person leaving."},
      { text: "Of course, the best wave, is a variation on the common wave, where an individual holds his arm outward to form a ninety degree angle with his elbow and forearm, and then move the arm back and forth horizontally, keeping the wrist locked, while maintaining eye contact with the recipient."},
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/waving/waving-1.jpg"] },
      { images: ["assets/img/waving/waving-2.jpg"] },
      { images: ["assets/img/waving/waving-3.jpg"] },
      { images: ["assets/img/waving/waving-4.jpg"] },
      { images: ["assets/img/waving/waving-5.jpg"] },
    ],
  },

  { // Pasta
    id: "pasta",
    title: "Tutto è Pasta",
    year: "2023",
    tags: "Brand Design",
    private: false, // locked placeholder — see gating notes above
    lightboxBg: "#000000",
    lightboxCaption: "#FFFFFF",
    cover: "assets/img/pasta/pasta-1.gif", // grid-tile image
    images: [
      "assets/img/pasta/pasta-3.jpg",
      "assets/img/pasta/pasta-1.gif",
      "assets/img/pasta/pasta-2.jpg",
    ],

    // SIDEBAR — explicit, renders top-to-bottom exactly as listed.
    // Entry types: { text } | { label, value } | { heading } | { role, name, href? }
    //            | { image, caption? } | { video, caption?, controls? }
    //   video: a local/remote .mp4/.webm/.mov path. Loops muted by default;
    //          add controls: true for a play/pause bar instead of autoplay.
    //          (An .mp4 in an `image` field also plays as video.)
    sidebar: [
      { title: "Strava" },
      //{ text: "Brand, Visual, and Animation Design for Strava." },
      { label: "Year", value: "2023" },
      { label: "Discipline", value: "Brand Design" },
      { text: "Branding and packaging Design for a pasta company." },
      { image: "assets/img/pasta/sidebar/pasta-sidebar-1.jpg", caption: "jack of all trades, master of all." },
      //{ image: "assets/img/strava/sidebar/go-outside.jpg", caption: "I think this is what it's all about." },
      { text: "Created for fun usings <a href='https://harrysdesigns.com/pasta'>Harrys typeface.</a>" },
        { heading: "All is pasta." },
      { text: "My family is Italian American, we have pasta at almost every family gathering, usually 2 or 3 different kinds (I'm not kidding, this isn't being funny, we really have a raviolli and a farfelle with 2 different kinds of sauces at most holidays). I think this excessive but can't see any other way of being." },
      { image: "assets/img/pasta/sidebar/pasta-sidebar-2.jpg", caption: "Consider what this image makes you feel." },
      { text: "I always thought every family did this, and in that spirit, I made some homemade fresh egg pasta as a christmas gift one year and designed this packaging for it. yum." },
    ],
    content: [
      // 1 image → full width
      { images: ["assets/img/pasta/pasta-3.jpg"] },
      { images: ["assets/img/pasta/pasta-1.gif"] },

      { images: ["assets/img/pasta/pasta-4.jpg", "assets/img/pasta/pasta-5.jpg", "assets/img/pasta/pasta-6.jpg"], ratio: "3:4" },
      { images: ["assets/img/pasta/pasta-9.jpg", "assets/img/pasta/pasta-11.jpg", "assets/img/pasta/pasta-12.jpg"], ratio: "3:4" },
    
    ],
  },

];
