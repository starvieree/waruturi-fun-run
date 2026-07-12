create type user_role as enum ('super_admin', 'admin', 'panitia');

create table
    profiles (
        id uuid primary key default gen_random_uuid (),
        auth_id uuid unique not null references auth.users (id) on delete cascade,
        name text not null,
        email text not null unique,
        avatar text,
        role user_role default 'admin',
        created_at timestamptz default now (),
        updated_at timestamptz default now ()
    );