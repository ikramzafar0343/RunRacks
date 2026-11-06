/**
 * Root layout — wraps every page in the App Router.
 */
import type { Metadata } from "next";
import { CartProvider } from "@/features/cart";
import { SiteHeaderWithCart } from "@/features/cart";
import { SiteFooter } from "@/shared/ui/SiteFooter";
import { SiteFooterGate } from "@/shared/ui/SiteFooterGate";
import { NavigationScrollReset } from "@/shared/ui/NavigationScrollReset";
import { SitePreloader } from "@/shared/ui/SitePreloader";
import { AiScrollPrompt } from "@/features/ai-advisor/components/AiScrollPrompt";
import { NotifyProvider } from "@/shared/ui/notify/NotifyProvider";
import { nourd, nourdHeading } from "@/styles/fonts";
import "@/shared/styles/dense-section-spacing.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "https://runracks.com",
  ),
  title: {
    default: "RunRacks",
    template: "%s | RunRacks",
  },
  description:
    "RunRacks VPS and Windows hosting with clear plans, NVMe storage, and full root or administrator access.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    siteName: "RunRacks",
    type: "website",
    images: [
      {
        url: "/runracks-logo-og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "RunRacks",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nourd.variable} ${nourdHeading.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${nourd.className} flex min-h-dvh flex-col overflow-x-hidden font-sans text-body`}
      >
        <NotifyProvider>
          <CartProvider>
            <SitePreloader />
            <NavigationScrollReset />
            <SiteHeaderWithCart />
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <SiteFooterGate>
              <SiteFooter />
            </SiteFooterGate>
            <AiScrollPrompt />
          </CartProvider>
        </NotifyProvider>
      </body>
    </html>
  );
}
