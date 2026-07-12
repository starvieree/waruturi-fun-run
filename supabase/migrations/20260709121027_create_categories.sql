create table
    event_categories (
        id bigint generated always as identity primary key,
        name text not null,
        slug text unique,
        created_at timestamptz default now ()
    );