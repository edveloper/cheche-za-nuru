import { getAllTeamMembers } from "@/lib/team-content";
import { TeamForm } from "@/components/team-form";

export default async function AdminTeamPage() {
  const members = await getAllTeamMembers();

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Team Management</h1>
        <p>Add, edit, and manage team members for the About page</p>
      </div>

      <TeamForm members={members} />
    </div>
  );
}
