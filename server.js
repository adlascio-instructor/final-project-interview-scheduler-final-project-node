const express = require("express");
const app = express();
const port = 8000;

const {listInterviewers} = require("./controllers/interviewers");

app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

app.get("/interviewers/:day", listInterviewers);




app.listen(port, () => console.log(`Server is running on port ${port}`))