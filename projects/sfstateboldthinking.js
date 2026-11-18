project({ // SF State Bold Thinking
id: "sfstateboldthinking",
title: "SF State Bold Thinking",
year: "2018",
tags: "BRAND DESIGN, WEB DESIGN",
seoDescription: "Logo redesign, brand refresh and Drupal website for Bold Thinking, San Francisco State University's alumni and donor fundraising campaign.",
private: false, // locked placeholder — see gating notes in projects/_template.js
cover: "assets/img/boldthinking/boldthinking-1.jpg", // grid-tile image
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
  { images: ["assets/img/boldthinking/boldthinking-7.mp4", "assets/img/boldthinking/boldthinking-8.jpg"], ratio: "1.91:1" },
],
});
