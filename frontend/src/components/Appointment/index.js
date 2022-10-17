import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import axios from "axios";


import "./styles.scss";

const Appointment = (props) => {
  const [add, setAdd] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [interviewers, setInterviewers] = React.useState(null);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    setEdit(false);
    console.log("BLABLABLA",interview);
    console.log("PROPSasdfsdf",props);
    console.log("ADD", add);
    console.log("EDIT", edit);
    if (edit) {
      interview.appointment_id = props.id;
      axios.post('http://localhost:8000/updateInterview/',interview)
          .then((response) => console.log(response));
    }
    props.bookInterview(interview);
  }
   
  React.useEffect(() => {
    console.log("props2",props.day);
    let test = axios.get("http://localhost:8000/interviewers/" + props.day)
      .then(response => { setInterviewers(response.data) });
  },[props.day]);

  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? (
        isDeleting ? (
          <Confirm
            message={"Are you sure you want to delete?"}
            onCancel={() => setIsDeleting(false)}
            onConfirm={() => {
              props.cancelInterview(props.id);
              console.log("DELETE");
              setIsDeleting(false);
            }}
          />
        ) : edit ? (
          <Form
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            interviewers={interviewers}
            onSave={save}
            onCancel={() => setEdit(false)}
          />
        ) : (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            interviewers={interviewers}
            onEdit={() => setEdit(true)}
            onDelete={() => setIsDeleting(true)}
          />
        )
      ) : add ? (
        <Form
          interviewers={interviewers}
          onSave={save}
          onCancel={() => setAdd(false)}
        />
      ) : (
        <Empty onAdd={() => setAdd(true)} />
      )}
    </article>
  );
};

export default Appointment;
