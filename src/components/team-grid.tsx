import { ContentImage } from "@/components/content-image";
import { TeamMember } from "@/lib/team-content";
import { toTitleCase } from "@/lib/title-case";

interface TeamGridProps {
  members: TeamMember[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0][0] ?? "?").toUpperCase();
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase();
}

export function TeamGrid({ members }: TeamGridProps) {
  if (!members || members.length === 0) {
    return (
      <div className="reading-card">
        <p>Meet our team coming soon.</p>
      </div>
    );
  }

  return (
    <div className="team-grid">
      {members.map((member) => (
        <article key={member.id} className="team-member-card">
          {member.profile_photo_path ? (
            <ContentImage
              src={member.profile_photo_path}
              alt={`Portrait of ${member.name}`}
              sizes="(max-width: 1000px) 100vw, 40vw"
              className="team-member-photo"
            />
          ) : (
            <div className="team-member-avatar" aria-hidden="true">
              {getInitials(member.name)}
            </div>
          )}
          <div className="team-member-info">
            <h3>{member.name}</h3>
            <p className="team-member-role">{toTitleCase(member.role)}</p>
            {member.bio
              ?.split(/\r?\n\s*\r?\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph} className="team-member-bio">
                  {paragraph}
                </p>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}
