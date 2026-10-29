import type { BlogContentBlock } from "../model/types";

type ArticleBodyProps = {
  content: readonly BlogContentBlock[];
};

export function ArticleBody({ content }: ArticleBodyProps) {
  const leadIndex = content.findIndex((block) => block.type === "p");

  return (
    <div className="articleBody">
      {content.map((block, index) => {
        if (block.type === "p") {
          return (
            <p
              key={`p-${index}`}
              className={index === leadIndex ? "articleLead" : undefined}
            >
              {block.text}
            </p>
          );
        }
        if (block.type === "h2") {
          return (
            <h2 key={block.id} id={block.id}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={block.id} id={block.id}>
              {block.text}
            </h3>
          );
        }
        return (
          <ul key={`ul-${index}`}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
