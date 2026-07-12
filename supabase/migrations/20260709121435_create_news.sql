create table
    news (
        id bigint generated always as identity primary key,
        title text,
        slug text,
        image text,
        content text,
        published boolean default false,
        created_at timestamptz default now ()
    );