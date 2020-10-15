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
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import UserModal from "./UserModal";
const firebase = require("firebase");

export default function UserTable(props) {
  var [users, setUsers] = useState([]);
  var [currentuser, setCurrentuser] = useState(undefined);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false);
  const [sortby, Setsortby] = useState("asc");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [downloading, setdownloading] = useState(false);

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
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((x) => x !== user));
    }
    await setTimeout(100);
    setShow(false);
    //console.log(selectedUsers);
  }

  async function DeleteUsers() {
    try {
      setBlocking(true);

      var selectedUsersStrings = selectedUsers.map((x) => `${x.phoneNumber}`);
      //console.log(selectedUsersStrings);
      var formdata = new URLSearchParams(); //FormData();
      formdata.append("data", selectedUsersStrings);
      formdata.append("collection", "users");

      var res = await fetch(
        // "http://localhost:5001/firstproject-3ca46/us-central1/deleteCollections",
        "https://us-central1-firstproject-3ca46.cloudfunctions.net/deleteCollections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formdata,
        }
      );

      setBlocking(false);
      setSelectedUsers([]);
      setSelected(false);
      getUsers();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{ display: "flex" }}>
          <Button
            variant={selected ? "danger" : "dark"}
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
              setSelectedUsers([]);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={"dark"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={async () => {
              //
              setdownloading(true);
              var res = await fetch(
                "https://us-central1-firstproject-3ca46.cloudfunctions.net/getUserCSV"
                // "http://localhost:5001/firstproject-3ca46/us-central1/getUserCSV"
              );
              var resjson = await res.json();
              const url = window.URL.createObjectURL(new Blob([resjson.file]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "Users_.csv");
              document.body.appendChild(link);
              setdownloading(false);
              link.click();
            }}
            disabled={downloading}
          >
            <div style={{ display: "flex" }}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{
                  display: downloading ? "block" : "none",
                  marginRight: "5px",
                  color: "white",
                }}
              />
              <h6>Download</h6>
            </div>
          </Button>
        </Col>
        <Col>
          <DropdownButton
            id="dropdown-sort"
            title={`sort by modified: ${sortby}`}
            variant="dark"
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
          <BlockUi
            tag="div"
            blocking={blocking}
            message="Deleting, please wait"
          >
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
          </BlockUi>
        </Col>
      </Row>
    </Container>
  );
}
