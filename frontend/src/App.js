import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from 'socket.io-client'
import "./App.scss";

import DayList from "./components/DayList";
import Appointment from "./components/Appointment";
// import daysData from "./components/__mocks__/days.json";
// import appointmentsData from "./components/__mocks__/appointments.json";

const socket = io.connect("http://localhost:8000");

export default function Application() {
  const [day, setDay] = useState("monday");
  const [days, setDays] = useState({});
  const [appointments, setAppointments] = useState({});
  const [appoinmentsRec, setAppointmentsRec] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/spots").then((res) => {
      setDays(res.data);
    });
  },[]);

  useEffect(() => {
    axios.get("http://localhost:8000/interviews/" + day).then((res) => {
      setAppointments(res.data);
    });
  },[day]);

  useEffect(() => {
    const key = Object.keys(appoinmentsRec)[0];
    if (key) {
      if (appointments[key] && JSON.stringify(appoinmentsRec) != JSON.stringify(appointments)) {
        setAppointments(appoinmentsRec);
      }
    }
  }, [appoinmentsRec]);
  
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setDays(data.days);
      setAppointmentsRec(data.appointments);
    })
  }, [socket]);
  
  useEffect(() => {
    socket.emit("send_message",{day,days,appointments});
  }, [appointments]);

  function bookInterview(id, interview) {
    
    const isEdit = appointments[id].interview;

    setAppointments((prev) => {
      
      const appointment = {
        ...prev[id],
        interview: { ...interview },
      };
      const appointments = {
        ...prev,
        [id]: appointment,
      };
      return appointments;
    });

    // INSERT
    if (!appointments[id].interview) {
      const appointment = appointments[id];
      appointment.interview = interview;
      axios.post('http://localhost:8000/insertInterview/',appointment)
        .then((response) => appointments[id] = response.data)
    }
    
    
    if (!isEdit) {
      setDays((prev) => {
        const updatedDay = {
          ...prev[day],
          spots: prev[day].spots - 1,
        };
        const days = {
          ...prev,
          [day]: updatedDay,
        };
        return days;
      });
    }
  }
  function cancelInterview(id) {

    // DELETE from BD
    axios.post('http://localhost:8000/deleteInterview/',appointments[id]);
    /////

    setAppointments((prev) => {
      const updatedAppointment = {
        ...prev[id],
        interview: null,
      };
      const appointments = {
        ...prev,
        [id]: updatedAppointment,
      };
      return appointments;
    });
    setDays((prev) => {
      const updatedDay = {
        ...prev[day],
        spots: prev[day].spots + 1,
      };
      const days = {
        ...prev,
        [day]: updatedDay,
      };
      return days;
    });

  }
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} value={day} onChange={setDay} />
        </nav>
      </section>
      <section className="schedule">
        {Object.values(appointments).map((appointment) => (
          <Appointment
            key={appointment.id}
            {...appointment}
            bookInterview={(interview) =>
              bookInterview(appointment.id, interview)
            }
            cancelInterview={cancelInterview}
            day={day}
          />
        ))}
        <Appointment key="last" time="5pm" day={day} />
      </section>
    </main>
  );
}
