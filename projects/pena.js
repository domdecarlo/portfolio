project({ // Pena
  id: "Pena",
  title: "PEÑA",
  year: "Ongoing",
  tags: "Brand Design, Illustration, Animation",
  seoDescription: "Album art, merchandise, illustration and animation for PEÑA, the project of Chilean-American artist Nico Peña: bedroom bossa nova and Latin jazz.",
  private: false, // locked placeholder — see gating notes in projects/_template.js
  cover: "assets/img/pena/pena-1-poster.jpg", // grid-tile image
  lightboxBg: "#840075" ,
  lightboxCaption: "#FFFFFF",
  images: [
    "assets/img/pena/pena-1.mp4",
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
    { images: ["assets/img/pena/pena-1.mp4"] },
    { images: ["assets/img/pena/pena-2.jpg", "assets/img/pena/pena-3.jpg"], ratio: "1:1" },
    { images: ["assets/img/pena/pena-4.jpg", "assets/img/pena/pena-5.jpg"], ratio: "1:1" },

    { images: ["assets/img/pena/pena-6.jpg"] },
    { images: ["assets/img/pena/pena-8.jpg", "assets/img/pena/pena-9.jpg"], ratio: "1:1" },

    { images: ["assets/img/pena/pena-13.jpg", "assets/img/pena/pena-14.jpg", "assets/img/pena/pena-15.jpg"], ratio: "1:1" },
    { images: ["assets/img/pena/pena-12.mp4", "assets/img/pena/pena-11.mp4"], ratio: "3:5" },
  ],
});
