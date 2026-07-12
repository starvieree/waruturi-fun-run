create table
    jerseys (
        id bigint generated always as identity primary key,
        event_id bigint references events (id) on delete cascade,
        title text,
        image text,
        description text
    );