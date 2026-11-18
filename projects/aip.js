project({ // AIP
id: "aip",
title: "AI Partnerships Corporation",
year: "2020",
tags: "Brand Design, Web Design",
seoDescription: "Brand identity and website design for AI Partnerships Corporation, an affiliate network connecting enterprises with AI-enabled solution integrators.",
private: false, // locked placeholder — see gating notes in projects/_template.js
cover: "assets/img/aip/aip-1.jpg", // grid-tile image
images: [
  "assets/img/aip/aip-3.mp4",
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
  { image: "assets/img/aip/sidebar/aip-sidebar-1.mp4", caption: "AIP offers you a rose, what do you do?" },
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
});
