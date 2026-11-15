import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Welcome to Chattanooga",
    short_name: "Chattanooga",
    description: "Explore the Scenic City like a local.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EC",
    theme_color: "#244B40",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
