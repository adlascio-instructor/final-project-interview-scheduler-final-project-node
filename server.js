const express = require("express");
const app = express();
const port = 8000;
const { Pool } = require("pg");

app.get("/days", (req, res) => {
  const pool = new Pool({
    user: "viniguimaraes",
    host: "localhost",
    database: "finalproject",
    password: "",
    port: 5432,
  });
  pool
    .query("SELECT * FROM days")
    .then((res) => res.rows)
    .then((students) => {
      console.log("days", name);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      pool.end();
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
