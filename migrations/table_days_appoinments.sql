drop table days;
drop table appoinments;

CREATE TABLE days
(id serial primary key,
name text);

CREATE TABLE appoinments
(id serial primary key,
time text,
dayid INTEGER references days(id)
);