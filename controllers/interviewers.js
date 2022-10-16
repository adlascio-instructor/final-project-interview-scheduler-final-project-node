const { response } = require('express');
const { Pool } = require("pg");
const interviewers = require('../models/interviewers.json');
require("dotenv").config();

const dbCredentials = {
   user: process.env.DB_NAME,
   host: process.env.DB_HOST,
   database: process.env.DB_DATABASE,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
 };


const listInterviewersDay = (req, res) => {
   console.log(req.params.day);

   const pool = new Pool(dbCredentials);
   pool
      .query(
         "SELECT interviewer.id, interviewer.name, interviewer.avatar from interviewer join available_interviewer on interviewer.id = available_interviewer.interviewer_id join days on days.id = available_interviewer.day_id  where days.name = $1",
         [req.params.day]
      )
      .then((result) => result.rows)
      .then((interviewer) => { console.log(interviewer); res.json(interviewer);  }) 
      .catch((err) => console.log("err",err))
      .finally(() => pool.end());

}

const insertInterview = (req, res) => {
   const appointment = req.body;
   const pool = new Pool(dbCredentials);
   pool
      .query(
         "INSERT INTO interview (student, interviewer_id, appointments_id) VALUES ($1,$2,$3) RETURNING *",
         [appointment.interview.student, appointment.interview.interviewer.id,appointment.id]
      )
      .then((result) => result.rows[0])
      .then((interview) => {
         appointment.interview.id = interview.id;
         res.json(appointment);
      })
      
      .catch((err) => console.log("err",err))
      .finally(() => pool.end());
}

const updateInterview = (req,res) => {
   console.log("UPDATE",req.body);
   const pool = new Pool(dbCredentials);
   pool
      .query(
         "UPDATE interview SET student = $1, interviewer_id = $2 WHERE appointments_id = $3",
         [req.body.student,req.body.interviewer.id,req.body.appointment_id]
      )
      .then((result) => result.rows[0])
      .then(() => res.json(req.body))      
      .catch((err) => console.log("err",err))
      .finally(() => pool.end());
}

const deleteInterview = (req, res) => {
   console.log("DELETE", req.body);
   const pool = new Pool(dbCredentials);
   pool
      .query(
         "DELETE FROM interview WHERE appointments_id = $1",
         [req.body.id]
      )
      .then((result) => result.rows[0])
      .then(() => res.json(req.body))      
      .catch((err) => console.log("err",err))
      .finally(() => pool.end());
}

module.exports = {
   listInterviewersDay, insertInterview, deleteInterview, updateInterview
}