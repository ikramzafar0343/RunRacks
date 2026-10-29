/**
 * Signed-out profile. No account system exists, so this page does not
 * invent a user, orders, or a sign-in form.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "No RunRacks account is signed in. Orders and sign-in are not available yet.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-6 pb-16 pt-28 md:pt-32">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">Account</p>
      <h1 className="mt-2 font-sans text-3xl font-medium tracking-tight text-heading md:text-4xl">
        Profile
      </h1>
      <p className="mt-4 text-base leading-relaxed text-body md:text-lg">
        No account is signed in. Orders, email, and password stay unavailable
        until an account system exists. This page does not show a stand-in
        user.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/pricing">View plans</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </main>
  );
}
