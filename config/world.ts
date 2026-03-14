export const WORLD_NAME = "Mittlemarch";

export const siteContent = {
  nav: [
    { label: "World", href: "#world" },
    { label: "Features", href: "#features" },
    { label: "Join the Waitlist", href: "#waitlist" }
  ],
  hero: {
    eyebrow: "An MMORPG teaser from a forgotten age",
    title: `Enter the World of ${WORLD_NAME}`,
    subtitle:
      "A new MMORPG adventure is coming. Ancient kingdoms stir, forgotten powers awaken, and the fate of Mittlemarch will belong to those bold enough to claim it.",
    primaryCta: "Join the Waitlist",
    secondaryCta: "Discover the World"
  },
  world: {
    intro:
      `${WORLD_NAME} is a land of shattered kingdoms, ancient magic, and untamed wilderness. For centuries its ruins have slept beneath the weight of history. Now something stirs beneath the soil of forgotten empires.`,
    body:
      "Across ember-lit cathedrals, drowned keeps, and forests older than memory, the world itself watches. Every road leads toward buried power, and every banner raised will alter what survives the age to come."
  },
  features: [
    {
      title: "Ancient Kingdoms",
      description: "Explore ruins, citadels, and lost dynasties carved into the bones of the realm."
    },
    {
      title: "Epic Adventures",
      description: "Delve into dungeons, hunt mythical beasts, and uncover relics veiled by legend."
    },
    {
      title: "Faction Conflict",
      description: "Choose your allegiance and influence who claims the future of Mittlemarch."
    },
    {
      title: "Living World",
      description: "A dynamic frontier of secrets, threats, and stories waiting to awaken."
    }
  ],
  gallery: {
    title: "Glimpses from the Veil",
    description:
      "Replace these placeholders with concept art, key art, or environmental stills as the world of Mittlemarch comes into focus.",
    items: [
      {
        title: "The Crownwatch Range",
        image: "/images/mittlemarch-mountains.jpg",
        fallback:
          "The peaks of Crownwatch stand over the old roads of Mittlemarch."
      },
      {
        title: "Shrine of Ashlight",
        image: "/images/mittlemarch-shrine.jpg",
        fallback: "A ruined sanctuary lit by dying flame"
      },
      {
        title: "Hall of Echoes",
        image: "/images/mittlemarch-hall.jpg",
        fallback: "A forgotten hall where light still lingers"
      }
    ]
  },
  waitlist: {
    title: `Join the ${WORLD_NAME} Waitlist`,
    description:
      "Claim your place before the gates open. Tell us how you play, what worlds you love, and whether you would answer the first call to alpha."
  },
  footer: {
    tagline: `Coming Soon to the World of ${WORLD_NAME}`,
    socials: ["Discord", "X / Twitter", "YouTube", "Email"]
  }
};
