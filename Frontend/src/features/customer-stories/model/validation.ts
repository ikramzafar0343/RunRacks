/**
 * Filter published stories that meet required fields.
 */
import type { CustomerStory } from "@/features/customer-stories/model/types";

export function isValidPublishedStory(story: CustomerStory): boolean {
  if (!story.published) return false;
  if (!story.id.trim()) return false;
  if (!story.customerName.trim()) return false;
  if (!story.quote.trim()) return false;
  if (!story.portraitUrl.trim()) return false;
  if (!story.portraitAlt.trim()) return false;
  return true;
}

export function getPublishedStories(
  stories: readonly CustomerStory[],
): CustomerStory[] {
  return stories
    .filter(isValidPublishedStory)
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
