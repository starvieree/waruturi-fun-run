create table
    registrations (
        id bigint generated always as identity primary key,
        event_id bigint references events (id),
        fullname text,
        email text,
        phone text,
        gender text,
        birth_date date,
        jersey_size text,
        emergency_contact text,
        payment_status text default 'pending',
        created_at timestamptz default now ()
    );