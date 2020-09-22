import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "./Users.css";
import UserModal from "./UserModal";
const firebase = require("firebase");

export default function UserTable(props) {
  var [users, setUsers] = useState([]);
  var [currentuser, setCurrentuser] = useState(undefined);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false);
  const [sortby, Setsortby] = useState("asc");
  const [selectedUsers, setSelectedUserd] = useState([]);

  useEffect(() => {
    getUsers();
  }, [sortby]);

  function getUsers() {
    var tempusers = [];
    firebase
      .firestore()
      .collection("users")
      .orderBy("updatedAt", sortby)
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

  async function selectItem(con, user) {
    if (con) {
      setSelectedUserd([...selectedUsers, user]);
    } else {
      setSelectedUserd(selectedUsers.filter((x) => x !== user));
    }
    await setTimeout(100);
    setShow(false);
    console.log(selectedUsers);
  }

  async function DeleteUsers() {
    await new Promise((res, rej) => {
      var deleted = 0;
      selectedUsers.forEach((user) => {
        res(true);
      });
    });
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{ display: "flex" }}>
          <Button
            variant={selected ? "danger" : "light"}
            disabled={
              selected ? (selectedUsers.length < 1 ? true : false) : false
            }
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={() => {
              if (!selected) {
                setSelected(true);
              } else {
                DeleteUsers();
              }
            }}
          >
            {selected ? "Delete" : "Select"}
          </Button>
          <Button
            variant={"info"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
              display: selected ? "block" : "none",
            }}
            onClick={() => {
              setSelected(false);
            }}
          >
            Cancle
          </Button>
        </Col>
        <Col>
          <DropdownButton
            id="dropdown-sort"
            title={`sort by: ${sortby}`}
            variant="light"
            style={{
              marginLeft: "auto",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
          >
            <Dropdown.Item onClick={Setsortby.bind(this, "asc")}>
              Asc
            </Dropdown.Item>
            <Dropdown.Item onClick={Setsortby.bind(this, "desc")}>
              Desc
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
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
                {selected ? <th>#</th> : ""}
                <th>No.</th>
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
                users.map((user, index) => {
                  return (
                    <tr
                      onClick={() => {
                        setCurrentuser(user);
                        setShow(true);
                      }}
                    >
                      {selected ? (
                        <input
                          type="checkbox"
                          style={{ marginTop: "10px" }}
                          onClick={(e) => {
                            selectItem(e.target.checked, user);
                          }}
                        />
                      ) : (
                        ""
                      )}
                      <td>{index + 1}</td>
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
