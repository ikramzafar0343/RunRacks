type ArticleTagsProps = {
  tags?: readonly string[];
};

export function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <ul className="articleTags" aria-label="Topics">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}
