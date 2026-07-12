create table
    faqs (
        id bigint generated always as identity primary key,
        question text,
        answer text,
        ordering integer default 1
    );