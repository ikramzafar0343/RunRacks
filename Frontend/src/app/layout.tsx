/**
 * Root layout — wraps every page in the App Router.
 */
import type { Metadata } from "next";
import { SiteFooter } from "@/shared/ui/SiteFooter";
import { SiteFooterGate } from "@/shared/ui/SiteFooterGate";
import { SiteHeader } from "@/shared/ui/SiteHeader";
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
  openGraph: {
    siteName: "RunRacks",
    type: "website",
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
      <body className="min-h-full flex flex-col font-sans text-body">
        <SiteHeader />
        {children}
        <SiteFooterGate>
          <SiteFooter />
        </SiteFooterGate>
      </body>
    </html>
  );
}
