project({
  id: "apparel",
  title: "Apparel",
  year: "Ongoing",
  tags: "Illustration, Apparel Design",
  seoDescription: "Shirts and clothing designed and illustrated by Dominic DeCarlo — for PEÑA, for collaborators, and for his own studio.",
  lightboxBg: "#000000",
  lightboxCaption: "#FFFFFF",
  cover: "assets/img/apparel/means-of-livelihood-back.jpg",
  images: [
    "assets/img/apparel/means-of-livelihood-back.jpg",
    "assets/img/apparel/pena-back.jpg",
    "assets/img/apparel/you-know-whats-right.jpg",
  ],

  sidebar: [
    { title: "Apparel" },
    { text: "Shirts and clothing I've designed and illustrated — for bands, for friends, and for myself." },
    { label: "Year", value: "Ongoing" },
    { label: "Discipline", value: "Illustration, Apparel Design, Screen Printing" },
    { image: "assets/img/apparel/sidebar/screen-in-the-shower.jpg", caption: "The print shop. Screens get washed out in the shower." },
    { text: "Most of these start as drawings and collage, then get pulled apart into one or two ink colours so they can be screen printed." },
  ],

  content: [
    { images: ["assets/img/apparel/clothesline.jpg"] },

    { heading: "Means of Livelihood — Ways of Life" },
    { images: ["assets/img/apparel/means-of-livelihood-front.jpg", "assets/img/apparel/means-of-livelihood-back.jpg"], ratio: "1:1" },

    { heading: "PEÑA" },
    { images: ["assets/img/apparel/pena-front.jpg", "assets/img/apparel/pena-back.jpg"], ratio: "1:1" },

    { heading: "DeCarlo Design" },
    { images: ["assets/img/apparel/decarlo-design-front.jpg", "assets/img/apparel/decarlo-design-back.jpg"] },

    { heading: "You Know What's Right — with Watts" },
    { images: ["assets/img/apparel/you-know-whats-right.jpg", "assets/img/apparel/you-know-whats-right-worn.jpg"], ratio: "1:1" },
  ],
});
