CREATE TABLE interviewer (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(255),
    avatar varchar(255)
);
CREATE TABLE interview (
    id SERIAL PRIMARY KEY NOT NULL,
    student varchar(255),
    interviewer_id INT REFERENCES interviewer(id),
    appointments_id INT REFERENCES appoinments(id)
);   

CREATE TABLE available_interviewer (
    id SERIAL PRIMARY KEY NOT NULL,
    interviewer_id INT REFERENCES interviewer(id),
    day_id INT REFERENCES days (id)
);
