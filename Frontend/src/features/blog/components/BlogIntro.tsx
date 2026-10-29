type BlogIntroProps = {
  eyebrow?: string;
  title?: string;
  lead: string;
};

export function BlogIntro({
  eyebrow = "The Journal",
  title = "Insights & Resources",
  lead,
}: BlogIntroProps) {
  return (
    <header className="blogIntro">
      <p className="blogIntroEyebrow">{eyebrow}</p>
      <h1 className="blogIntroTitle">{title}</h1>
      <p className="blogIntroLead">{lead}</p>
    </header>
  );
}
