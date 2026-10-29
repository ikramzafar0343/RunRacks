/**
 * Published journal articles — RunRacks byline; swap for CMS later.
 */
import type { BlogArticle } from "@/features/blog/model/types";
import { OPS_POSTS } from "./posts-ops";
import { SECURITY_POSTS } from "./posts-security";
import { VPS_POSTS } from "./posts-vps";
import { WINDOWS_POSTS } from "./posts-windows";

export const BLOG_POSTS: readonly BlogArticle[] = [
  ...VPS_POSTS,
  ...SECURITY_POSTS,
  ...WINDOWS_POSTS,
  ...OPS_POSTS,
];
