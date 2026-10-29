import type { Route } from "next";
import { redirect } from "next/navigation";

/** Legacy Solutions URL — configurator lives at /customize. */
export default function SolutionsRedirectPage() {
  redirect("/customize" as Route);
}
