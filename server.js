const express = require("express");
const app = express();
const port = 8000;
require("dotenv").config();
const { Pool } = require("pg");
require("dotenv").config();

const dbCredentials = {
  user: process.env.DB_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

console.log(dbCredentials);
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

// app.get("/avaiable_interviewers", (req, res) => {
//   const pool = new Pool(dbCredentials);
//   pool
//     .query(
//       `SELECT id FROM available_interviewer
//        JOIN days
//        ON day_id = days.id
//        JOIN interviewer
//        ON interviewer_id = interviewer.id
//        ;
//     `
//     )
//     .then((res) => res.rows)
//     .then((avaiable_interviewers) => {
//       console.log("avaiable_interviewers", avaiable_interviewers);
//     })
//     .catch((err) => {
//       console.log("err", err);
//     })
//     .finally(() => {
//       pool.end();
//     });
// });

app.listen(port, () => console.log(`Server is running on port ${port}`));
