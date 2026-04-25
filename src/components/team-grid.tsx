import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import { TeamMember } from "@/lib/team-content";

interface TeamGridProps {
  members: TeamMember[];
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
          {member.profile_photo_path && (
            <ContentImage
              src={member.profile_photo_path}
              alt={member.name}
              sizes="(max-width: 900px) 100vw, 30vw"
              className="team-member-photo"
            />
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
