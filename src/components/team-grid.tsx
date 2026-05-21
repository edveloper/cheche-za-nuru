import { ContentImage } from "@/components/content-image";
import { TeamMember } from "@/lib/team-content";

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
    <div className="three-column-grid">
      {members.map((member) => (
        <article key={member.id} className="team-member-card">
          {member.profile_photo_path ? (
            <div className="team-member-photo-wrap">
              <ContentImage
                src={member.profile_photo_path}
                alt={member.name}
                sizes="7.5rem"
                className="team-member-photo"
              />
            </div>
          ) : (
            <div className="team-member-avatar" aria-hidden="true">
              {getInitials(member.name)}
            </div>
          )}
          <div className="team-member-info">
            <h3>{member.name}</h3>
            <p className="team-member-role">{member.role}</p>
            {member.bio && <p className="team-member-bio">{member.bio}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
