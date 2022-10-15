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

app.get("/avaiable_interviewers", (req, res) => {
  const pool = new Pool(dbCredentials);
  pool
    .query(
      "SELECT name FROM interviewer JOIN interviewer ON (id = interviewer_id) "
    )
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

app.listen(port, () => console.log(`Server is running on port ${port}`));
