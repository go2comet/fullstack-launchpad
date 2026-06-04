-- Local dev seed only — never runs against production.
-- After `supabase db reset`, you can call `supabase db seed` to load this.

-- Example: seed tasks for the first user in the local auth.users table
do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users limit 1;

  if v_user_id is not null then
    insert into public.tasks (user_id, title, description, is_complete) values
      (v_user_id, 'Set up Supabase project', 'Create project, link locally, and apply migrations.', true),
      (v_user_id, 'Configure OAuth providers', 'Add Google OAuth credentials in the Supabase dashboard.', false),
      (v_user_id, 'Deploy to Vercel', 'Wire env vars and verify the preview deploy.', false);
  end if;
end;
$$;
