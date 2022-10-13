CREATE TABLE interview {
    id SERIAL PRIMARY KEY NOT NULL,
    student varchar(255),
    interviewer_id INT,
    appointments_id INT,
    FOREIGN KEY (interviewer_id) REFERENCES (interviewers) id,
    FOREIGN KEY (appointments_id) REFERENCES (appointment) id 
}   

CREATE TABLE available_interviewer {
    id SERIAL PRIMARY KEY NOT NULL,
    interviewer_id INT,
    day_id INT,
    FOREIGN KEY (interviewer_id) REFERENCES (interviewers) id,
    FOREIGN KEY (day_id) REFERENCES (day) id
}

CREATE TABLE interviewer {
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(255),
    avatar varchar(255)
}