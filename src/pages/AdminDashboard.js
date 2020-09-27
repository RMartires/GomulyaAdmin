import React, { Component, useState, useEffect } from "react";
import {
  Navbar,
  Button,
  Modal,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserTable from "./components/UserTable";
import OrderTable from "./components/OrderTable";

export default class AdminDashboard extends Component {
  state = {
    UserTable: true,
    notify: false,
    email: false,
    select: false,
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
  const [selectedlocations, setSelectedlocations] = useState(locations);

  const selectItem = (con, value) => {
    if (con) {
      setSelectedlocations([...selectedlocations, value]);
    } else {
      setSelectedlocations(selectedlocations.filter((x) => x !== value));
    }
  };

  const onSubmit = async (data) => {
    console.log(`notifying ${selectedlocations}`);
    setSend(true);
    console.log(data);
    try {
      var doneSending = 0;
      await new Promise((res, rej) => {
        selectedlocations.forEach(async (loc) => {
          await fetch(
            // `http://localhost:5001/firstproject-3ca46/us-central1/Notify?title=${data.title}&body=${data.body}&topic=${loc}`
            `https://us-central1-firstproject-3ca46.cloudfunctions.net/Notify?title=${data.title}&body=${data.body}&topic=${loc}`
          );
          doneSending = doneSending + 1;
          if (doneSending === selectedlocations.length) {
            res("sent");
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
    setSelectedlocations(locations);
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
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {locations.map((el) => {
              return (
                <div style={{ margin: "5px" }}>
                  <h6>{el}</h6>
                  <input
                    type="checkbox"
                    style={{ marginTop: "10px" }}
                    onClick={(e) => {
                      selectItem(e.target.checked, el);
                    }}
                    checked={selectedlocations.includes(el)}
                  />
                </div>
              );
            })}
          </div>
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
  const [northsend, setNorthsend] = useState(false);
  const [southsend, setSouthsend] = useState(false);
  const locations = ["North", "South"];
  const [selectedlocations, setSelectedlocations] = useState([]);
  const [generate, setGenerate] = useState(false);
  const [Gloading, setGLoading] = useState(false);
  const [arr, setArr] = useState([false, false]);
  const [NorthEmail, setNorthEmail] = useState("namit@palasha.in"); //"namit@palasha.in";
  const [SouthEmail, setSouthEmail] = useState("sarthak.mkt@yahoo.com"); //"sarthak.mkt@yahoo.com";

  const onGenerate = async () => {
    try {
      setGLoading(true);
      var res = await fetch(
        // "http://localhost:5001/firstproject-3ca46/us-central1/createCSV"
        "https://us-central1-firstproject-3ca46.cloudfunctions.net/createCSV "
      );
      var resjson = await res.json();
      setArr(resjson.files);
      setGenerate(true);
      setGLoading(false);
    } catch (err) {
      console.log(err);
      setGLoading(false);
    }
  };

  const selectItem = (con, value) => {
    if (con) {
      setSelectedlocations([...selectedlocations, value]);
    } else {
      setSelectedlocations(selectedlocations.filter((x) => x !== value));
    }
  };

  const onSubmit = async (file, name, to) => {
    try {
      var formdata = new URLSearchParams();
      formdata.append("file", file);
      formdata.append("name", name);
      formdata.append("to", to);
      await fetch(
        // "http://localhost:5001/firstproject-3ca46/us-central1/sendMail",
        `https://us-central1-firstproject-3ca46.cloudfunctions.net/createCSV`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formdata,
        }
      );

      if (name === "North_Goa.csv") {
        setNorthsend(true);
      } else {
        setSouthsend(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal
      show={props.email}
      onHide={() => {
        props.setEmail(false);
        setGenerate(false);
      }}
      centered
    >
      <Modal.Header>Send Email</Modal.Header>
      <Modal.Body>
        <Container style={{ textAlign: "center" }}>
          {!generate ? (
            <Row>
              <Col>
                {Gloading ? (
                  <Spinner
                    animation="border"
                    style={{ marginRight: "auto", marginLeft: "auto" }}
                  />
                ) : (
                  <Button variant="info" onClick={onGenerate.bind(this)}>
                    Generate
                  </Button>
                )}
              </Col>
            </Row>
          ) : (
            <div>
              <Row>
                <Col>
                  {selectedlocations.includes("North") && arr[0] ? (
                    <Button
                      style={
                        !northsend
                          ? {
                              backgroundColor: "#bf1650",
                              borderColor: "#bf1650",
                            }
                          : {
                              backgroundColor: "#1bd939",
                              borderColor: "#1bd939",
                            }
                      }
                      onClick={onSubmit.bind(
                        this,
                        arr[0],
                        "North_Goa.csv",
                        NorthEmail
                      )}
                    >
                      {northsend ? "Sent" : "Send North_Goa.csv"}
                    </Button>
                  ) : (
                    <div>
                      <input
                        type="text"
                        defaultValue={NorthEmail}
                        onKeyUp={(e) => {
                          setNorthEmail(e.target.value);
                        }}
                      />
                      <div style={{ display: "flex" }}>
                        <Button
                          variant="info"
                          disabled={!arr[0]}
                          onClick={() => {
                            const url = window.URL.createObjectURL(
                              new Blob([arr[0]])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "North_Goa.csv");
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          Pre-View North
                        </Button>
                        <div style={{ margin: "5px", margin: "auto" }}>
                          <h6>approve</h6>
                          <input
                            type="checkbox"
                            style={{ marginTop: "10px" }}
                            onClick={(e) => {
                              selectItem(e.target.checked, "North");
                            }}
                            checked={selectedlocations.includes("North")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
                <Col>
                  {selectedlocations.includes("South") && arr[1] ? (
                    <Button
                      style={
                        !southsend
                          ? {
                              backgroundColor: "#bf1650",
                              borderColor: "#bf1650",
                            }
                          : {
                              backgroundColor: "#1bd939",
                              borderColor: "#1bd939",
                            }
                      }
                      varient={southsend ? "success" : ""}
                      onClick={onSubmit.bind(
                        this,
                        arr[1],
                        "South_Goa.csv",
                        SouthEmail
                      )}
                    >
                      {southsend ? "Sent" : "Send South_Goa.csv"}
                    </Button>
                  ) : (
                    <div>
                      <input
                        type="text"
                        defaultValue={SouthEmail}
                        onKeyUp={(e) => {
                          setSouthEmail(e.target.value);
                        }}
                      />
                      <div style={{ display: "flex" }}>
                        <Button
                          variant="info"
                          disabled={!arr[1]}
                          onClick={() => {
                            const url = window.URL.createObjectURL(
                              new Blob([arr[1]])
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "South_Goa.csv");
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          Pre-View South
                        </Button>
                        <div style={{ margin: "5px", margin: "auto" }}>
                          <h6>approve</h6>
                          <input
                            type="checkbox"
                            style={{ marginTop: "10px" }}
                            onClick={(e) => {
                              selectItem(e.target.checked, "South");
                            }}
                            checked={selectedlocations.includes("South")}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
}
