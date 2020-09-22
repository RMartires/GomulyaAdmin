import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Spinner } from "react-bootstrap";
import "./Users.css";
import UserModal from "./UserModal";
const firebase = require("firebase");

export default function UserTable() {
  var [users, setUsers] = useState([]);
  var [currentuser, setCurrentuser] = useState(undefined);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container fluid>
      {currentuser ? (
        <UserModal
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
              {loading ? (
                <Spinner
                  animation="border"
                  style={{ marginRight: "auto", marginLeft: "auto" }}
                />
              ) : (
                users.map((user) => {
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
                })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
