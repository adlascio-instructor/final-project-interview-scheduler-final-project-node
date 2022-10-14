const { response } = require('express');
const interviewers = require('../models/interviewers.json');


const listInterviewers = (req, res) => {
   // console.log("interviewers", interviewers);
   // console.log(interviewers);
   console.log(req.params.day);
   res.json(interviewers);
   
   // res.JSON("fdsfsad");
}


module.exports = {
   listInterviewers
}