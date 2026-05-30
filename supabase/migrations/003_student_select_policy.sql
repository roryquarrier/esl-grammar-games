-- Allow unauthenticated reads of students for the avatar select screen
-- This is safe because student data (name + avatar) is not sensitive,
-- and the student select is a tap-to-enter flow with no auth required.

create policy students_select_public
  on students for select
  using (deleted_at is null);
