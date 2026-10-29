/**
 * Local font setup with next/font/local (WOFF2 for slow networks).
 *
 * Body/UI faces: preload false (avoids unused-weight warnings).
 * Heading face (700): preload true — matches LCP hero titles (font-weight 700).
 *
 * Run `npm run optimize:assets` once to generate .woff2 from .ttf sources.
 */
import localFont from "next/font/local";

export const nourd = localFont({
  src: [
    {
      path: "./fonts/nourd_light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/nourd_regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/nourd_medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/nourd_semi_bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/nourd_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nourd",
  display: "swap",
  preload: false,
});

/** Preloads nourd bold only — same file as weight 700 in `nourd`. */
export const nourdHeading = localFont({
  src: [
    {
      path: "./fonts/nourd_bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nourd-heading",
  display: "swap",
  preload: true,
});
