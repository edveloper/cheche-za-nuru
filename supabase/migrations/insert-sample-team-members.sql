-- Insert sample team members
INSERT INTO public.team_members (name, role, bio, profile_photo_path, sort_order, is_active)
VALUES
  (
    'Sarah Mwangi',
    'Executive Director',
    'Sarah has led Cheche Za Nuru for over 5 years, bringing a passion for education and community-centered development. She oversees all programs and strategic initiatives.',
    'https://efzetksxzvpvbobrxtgj.supabase.co/storage/v1/object/public/team-photos/sarah-mwangi.jpg',
    0,
    true
  ),
  (
    'David Kipchoge',
    'Programs & Impact Manager',
    'David manages our education, healthcare, and sports programs across multiple communities. He ensures our work stays aligned with the needs of the families we serve.',
    'https://efzetksxzvpvbobrxtgj.supabase.co/storage/v1/object/public/team-photos/david-kipchoge.jpg',
    1,
    true
  )
ON CONFLICT DO NOTHING;
