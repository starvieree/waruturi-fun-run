create table
    timelines (
        id bigint generated always as identity primary key,
        event_id bigint references events (id),
        title text,
        event_date date,
        description text
    );