import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeanStreak",
    short_name: "LeanStreak",
    description: "Build healthy habits, one streak at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#dfe5ef",
    theme_color: "#dfe5ef",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
