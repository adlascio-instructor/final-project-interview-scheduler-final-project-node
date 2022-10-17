const express = require("express");
const app = express();
const port = 8000;
require("dotenv").config();
const { Pool } = require("pg");

const dbCredentials = {
  user: process.env.DB_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/days", (req, res) => {
  const pool = new Pool(dbCredentials);
  pool
    .query("SELECT * FROM days")
    .then((res) => res.rows)
    .then((days) => {
      console.log("days", days);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      pool.end();
    });
});

app.get("/spots", (req, res) => {
  console.log("credentials", dbCredentials);
  const pool = new Pool(dbCredentials);
  pool
    .query(
      `SELECT dayid, days.name,
      COUNT(appoinments.*) AS appointments,
      COUNT(interview.*) as interviews
      FROM appoinments
      JOIN days ON days.id = appoinments.dayid
      LEFT JOIN interview ON appoinments.id = interview.appointments_id
      GROUP BY dayid, days.name
      ORDER BY dayid;`
    )
    .then((res) => res.rows)
    .then((days) => {
      const obj = {};

      days.forEach((element) => {
        obj[element.name] = {
          id: element.dayid,
          name: element.name,
          spots: Number(element.appointments) - Number(element.interviews),
        };
      });
      res.json(obj);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      pool.end();
    });
});

app.get("/interviewer", (req, res) => {
  const pool = new Pool(dbCredentials);
  pool
    .query("SELECT * FROM interviewer")
    .then((res) => res.rows)
    .then((interviewer) => {
      console.log("interviewer", interviewer);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      pool.end();
    });
});

app.get("/interviews/:day", (req, res) => {
  const day = req.params.day;
  const pool = new Pool(dbCredentials);
  pool
    .query(
      `SELECT appoinments.id, time, interview.student, interviewer.id AS interviewer_id, interviewer.name, interviewer.avatar FROM appoinments
      LEFT JOIN interview
      ON appointments_id = appoinments.id 
      LEFT JOIN interviewer 
      ON interviewer_id = interviewer.id
      JOIN days
      ON dayid = days.id
      WHERE days.name = $1
      ORDER BY appoinments.id
      ; 
      `,
      [day]
    )
    .then((res) => res.rows)
    .then((interviews) => {
      const obj = {};

      interviews.forEach((element) => {
        obj[element.id] = {
          id: element.id,
          time: element.time
        };
        if (element.student) {
          obj[element.id].interview = {
              student: element.student,
              interviewer: {
                id: element.interviewer_id,
                name: element.name,
                avatar: element.avatar,
              },
            };
        };
      });
      console.log("oi", obj);
      res.json(obj);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      pool.end();
    });
});

const {listInterviewersDay,insertInterview, deleteInterview, updateInterview} = require("./controllers/interviewers");

app.get("/interviewers/:day", listInterviewersDay);
app.post("/insertInterview",insertInterview);
app.post("/updateInterview",updateInterview);
app.post("/deleteInterview",deleteInterview);



app.listen(port, () => console.log(`Server is running on port ${port}`))
