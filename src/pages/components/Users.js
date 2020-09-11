import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Users.css";
const firebase = require("firebase");

export default function Users() {
  var [users, setUsers] = useState([]);
  var [currentuser, setCurrentuser] = useState(undefined);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    var tempusers = [];
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempusers.push(doc.data());
        });
        setUsers(tempusers);
      });
  }

  return (
    <Container fluid>
      {currentuser ? (
        <UserModel
          show={show}
          user={currentuser}
          setShow={setShow}
          getUsers={getUsers}
          setCurrentuser={setCurrentuser}
        />
      ) : (
        ""
      )}
      <Row>
        <Col>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th className="tablecontent">Email</th>
                <th className="tablecontent">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr
                    onClick={() => {
                      setCurrentuser(user);
                      setShow(true);
                    }}
                  >
                    <td>{user.name}</td>
                    <td>{user.phoneNumber}</td>
                    <td className="tablecontent">{user.email}</td>
                    <td className="tablecontent">{user.address}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

function UserModel(props) {
  var [edit, setEdit] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    data.name = props.user.name;
    await firebase
      .firestore()
      .collection("users")
      .doc(props.user.email)
      .set(data);
    props.getUsers();
    props.setCurrentuser(data);
    setEdit(false);
  };

  return (
    <Modal
      show={props.show}
      onHide={() => {
        props.setShow(false);
        setEdit(false);
      }}
      centered
    >
      <Modal.Header closeButton>
        <h4>{props.user.name}</h4>
      </Modal.Header>
      {edit ? (
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              defaultValue={props.user.phoneNumber}
              ref={register({ required: true, maxLength: 10 })}
            />
            {errors.phoneNumber && (
              <p>This field is required and maxLength 10</p>
            )}
            <label>Email</label>
            <input
              name="email"
              defaultValue={props.user.email}
              ref={register({
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              })}
            />
            {errors.email && (
              <p>This field is required and should be in a email format</p>
            )}
            <label>Address</label>
            <input
              name="address"
              defaultValue={props.user.address}
              ref={register({
                required: true,
              })}
            />
            {errors.address && <p>This field is required</p>}
            <Button type="submit">Update</Button>
          </form>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h5>Phone Number: {props.user.phoneNumber}</h5>
          <h5>Email: {props.user.email}</h5>
          <h5>Address: {props.user.address}</h5>
          <div style={{ marginLeft: "auto", width: "min-content" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setEdit(true);
              }}
            >
              Edit
            </Button>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
}
