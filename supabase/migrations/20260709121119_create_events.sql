create table
    events (
        id bigint generated always as identity primary key,
        category_id bigint references event_categories (id),
        title text not null,
        slug text unique,
        description text,
        date_event date,
        start_time time,
        location text,
        maps text,
        quota integer,
        price numeric,
        banner text,
        registration_open boolean default true,
        created_at timestamptz default now ()
    );