project({ // Pasta
  id: "pasta",
  title: "Tutto è Pasta",
  year: "2023",
  tags: "Brand Design",
  seoDescription: "Branding and packaging for Tutto è Pasta, a batch of fresh egg pasta made as a Christmas gift for an Italian-American family that never serves one kind.",
  private: false, // locked placeholder — see gating notes in projects/_template.js
  lightboxBg: "#000000",
  lightboxCaption: "#FFFFFF",
  cover: "assets/img/pasta/pasta-1-poster.jpg", // grid-tile image
  images: [
    "assets/img/pasta/pasta-3.jpg",
    "assets/img/pasta/pasta-1.mp4",
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
    { images: ["assets/img/pasta/pasta-1.mp4"] },

    { images: ["assets/img/pasta/pasta-4.jpg", "assets/img/pasta/pasta-5.jpg", "assets/img/pasta/pasta-6.jpg"], ratio: "3:4" },
    { images: ["assets/img/pasta/pasta-9.jpg", "assets/img/pasta/pasta-11.jpg", "assets/img/pasta/pasta-12.jpg"], ratio: "3:4" },

  ],
});
