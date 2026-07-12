create table
    sponsors (
        id bigint generated always as identity primary key,
        name text,
        logo text,
        website text
    );