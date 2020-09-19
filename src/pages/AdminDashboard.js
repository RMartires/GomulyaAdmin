import React, { Component, useState } from "react";
import { Navbar, Button, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserTable from "./components/UserTable";
import OrderTable from "./components/OrderTable";

export default class AdminDashboard extends Component {
  state = {
    UserTable: true,
    notify: false,
    email: false,
  };

  setNotify = (condition) => {
    this.setState({ notify: condition });
  };
  setEmail = (condition) => {
    this.setState({ email: condition });
  };

  render() {
    return (
      <div>
        <NotifyModal
          setNotify={this.setNotify.bind(this)}
          notify={this.state.notify}
        />
        <EmailModal
          setEmail={this.setEmail.bind(this)}
          email={this.state.email}
        />
        <Navbar bg="light">
          <Button
            variant="light"
            onClick={() => {
              this.setState({ UserTable: true });
            }}
          >
            Users
          </Button>
          <Button
            variant="light"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              this.setState({ UserTable: false });
            }}
          >
            Orders
          </Button>
          <Button
            style={{ marginLeft: "auto" }}
            onClick={this.setEmail.bind(this, true)}
          >
            Email
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            onClick={this.setNotify.bind(this, true)}
          >
            Notify
          </Button>
        </Navbar>
        <br />
        {this.state.UserTable ? <UserTable /> : <OrderTable />}
      </div>
    );
  }
}

function NotifyModal(props) {
  const { register, handleSubmit, errors } = useForm();
  const [send, setSend] = useState(false);
  const locations = [
    "panaji",
    "merces",
    "chimbel",
    "kadamba",
    "porvorim",
    "mapusa",
    "margao",
    "vasco",
  ];

  const onSubmit = async (data) => {
    setSend(true);
    console.log(data);
    try {
      if (data.location === "all") {
        var doneSending = 0;
        await new Promise((res, rej) => {
          locations.forEach(async (loc) => {
            await fetch(
              `https://us-central1-firstproject-3ca46.cloudfunctions.net/Notify?title=${data.title}&body=${data.body}&topic=${loc}`
            );
            doneSending = doneSending + 1;
            if (doneSending === locations.length) {
              res("sent");
            }
          });
        });
      } else {
        await fetch(
          `https://us-central1-firstproject-3ca46.cloudfunctions.net/Notify?title=${data.title}&body=${data.body}&topic=${data.location}`
        );
      }
    } catch (err) {
      console.log(err);
    }
    setSend(false);
    props.setNotify(false);
  };

  return (
    <Modal
      show={props.notify}
      onHide={() => {
        props.setNotify(false);
      }}
      centered
    >
      <Modal.Header>Send Notification</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Title</label>
          <input name="title" ref={register({ required: true })} />
          {errors.title && (
            <p>This field is required and should be an integer</p>
          )}
          <label>Body</label>
          <input name="body" ref={register({ required: true })} />
          {errors.body && (
            <p>This field is required and should be an integer</p>
          )}
          <label>Location</label>
          <select
            className="select-css"
            name="location"
            ref={register({
              required: true,
            })}
          >
            <option value="all">All</option>
            {locations.map((x) => {
              return <option value={x}>{x}</option>;
            })}
          </select>
          <Button variant="info" type="submit">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={
                send
                  ? { dislay: "block", marginRight: "10px" }
                  : { display: "none" }
              }
            />
            Send
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

function EmailModal(props) {
  const { register, handleSubmit, errors } = useForm();
  const [send, setSend] = useState(false);

  const onSubmit = async (data) => {
    setSend(true);
    console.log(data);
    try {
      await fetch(
        `https://us-central1-firstproject-3ca46.cloudfunctions.net/createCSV?to=${data.to}`
      );
    } catch (err) {
      console.log(err);
    }
    setSend(false);
    props.setEmail(false);
  };

  return (
    <Modal
      show={props.email}
      onHide={() => {
        props.setEmail(false);
      }}
      centered
    >
      <Modal.Header>Send Email</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>To</label>
          <input
            name="to"
            ref={register({
              required: true,
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
          />
          {errors.to && (
            <p>This field is required and should be a valid email</p>
          )}
          <Button variant="info" type="submit">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={
                send
                  ? { dislay: "block", marginRight: "10px" }
                  : { display: "none" }
              }
            />
            Send
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
