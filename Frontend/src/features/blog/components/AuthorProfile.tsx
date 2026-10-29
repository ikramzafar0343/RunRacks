import Image from "next/image";

type AuthorProfileProps = {
  name: string;
  bio: string;
  avatarUrl?: string;
};

export function AuthorProfile({ name, bio, avatarUrl }: AuthorProfileProps) {
  return (
    <aside
      className={
        avatarUrl ? "articleAuthor" : "articleAuthor articleAuthor--textOnly"
      }
      aria-label="About the author"
    >
      {avatarUrl ? (
        <Image
          className="articleAuthorAvatar"
          src={avatarUrl}
          alt=""
          width={64}
          height={64}
        />
      ) : null}
      <div>
        <p className="articleAuthorEyebrow">Written by</p>
        <p className="articleAuthorName">{name}</p>
        <p className="articleAuthorBio">{bio}</p>
      </div>
    </aside>
  );
}
