project({ // Strava
  id: "strava",
  title: "Strava",
  year: "2024-",
  tags: "Brand Design",
  seoDescription: "Brand identity, GTM campaigns, event design and product animation at Strava, shaping how the brand looks and moves for millions of active people.",
  private: true, // locked placeholder — see gating notes in projects/_template.js
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
    { text: "At Strava I work across brand and product design: brand identity, GTM campaigns, event design, and product animation. I help shape (with a talented team of designers) how the brand looks and moves in the world." },
    { text: "What keeps it interesting is the audience and community. Every kudos given, activity recording and achievement belongs to a real person, and with a unified brand language bringing us all together into one enormous team. Movement, health and community " },
    { image: "assets/img/strava/sidebar/kudo-animated.mp4", caption: "How it feels to give a 'Kudos'." },
      { heading: "What I love about moving." },
    { text: "Strava is here to motivate people to live their best active lives and to connect the community that moves. It's a mission I happen to believe in on my days off, too. I like to bike, and I know how good it feels to put in an effort and share it. It can be anything, Bike enlightenment, run, walk, climb. It doesn't matter - It's about connecting with those around you, sharing in the movement and encouraging the people around you. " },
    { text: "That's the feeling I chase in the work. I want design that solves problems, that makes it easier to connect, to share, and to inspire. That feeling of being human is about honesty, generousity, a getting a little bit sweaty. It's better when it's shared. It's less about polish for its own sake and more about celebrating effort — whoever's putting it in — and making people want to get to their effort and connect with their community." },
    { image: "assets/img/strava/sidebar/strava-activity-card.png", caption: "<a href='https://www.strava.com/athletes/140234296'>I love being on a bicycle, please click and see.</a>" },
  ],
  content: [
    // 1 image → full width
    { images: ["assets/img/strava/strava-1.jpg"] },
  ],
});
