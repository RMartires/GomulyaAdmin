import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "./Users.css";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import OrderModal from "./OrderModal";
const firebase = require("firebase");

export default function UserTable() {
  var [orders, setOrders] = useState([]);
  var [currentorder, setCurrentorder] = useState(undefined);
  const [show, setShow] = useState(false);
  const [showpaid, setShowpaid] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortby, Setsortby] = useState("asc");

  const [selected, setSelected] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    getOrders();
  }, [sortby]);

  async function selectItem(con, order) {
    if (con) {
      setSelectedOrders([...selectedOrders, order]);
    } else {
      setSelectedOrders(selectedOrders.filter((x) => x !== order));
    }
    await setTimeout(100);
    setShow(false);
    //console.log(selectedOrders);
  }

  async function DeleteOrders() {
    try {
      setBlocking(true);

      var selectedOrdersStrings = selectedOrders.map((x) => `${x.phoneNumber}`);
      //console.log(selectedOrdersStrings);
      var formdata = new URLSearchParams(); //FormData();
      formdata.append("data", selectedOrdersStrings);
      formdata.append("collection", "orders");

      var res = await fetch(
        "http://localhost:5001/firstproject-3ca46/us-central1/deleteCollections",
        // "https://us-central1-firstproject-3ca46.cloudfunctions.net/deleteCollections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formdata,
        }
      );

      setBlocking(false);
      setSelectedOrders([]);
      setSelected(false);
      getOrders();
    } catch (err) {
      console.log(err);
    }
  }

  function getOrders() {
    var temporders = [];
    firebase
      .firestore()
      .collection("orders")
      .orderBy("updatedAt", sortby)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          temporders.push(doc.data());
        });
        setOrders(temporders);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function toggelOrderStatus(order) {
    if (order.orderStatus) {
      order.orderStatus = false;
    } else {
      order.orderStatus = true;
    }
    await firebase
      .firestore()
      .collection("orders")
      .doc(order.phoneNumber)
      .set(order);
    getOrders();
    setShowpaid(false);
    setShow(false);
    setConfirm(false);
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{ display: "flex" }}>
          <Button
            variant={selected ? "danger" : "light"}
            disabled={
              selected ? (selectedOrders.length < 1 ? true : false) : false
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
                DeleteOrders();
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
              setSelectedOrders([]);
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
              width: "max-content",
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
      {currentorder ? (
        <OrderModal
          show={show && !showpaid}
          order={currentorder}
          setShow={setShow}
          getOrders={getOrders}
          setCurrentorder={setCurrentorder}
        />
      ) : (
        ""
      )}
      <Modal
        show={confirm}
        onHide={() => {
          setConfirm(false);
          setShowpaid(false);
          setShow(false);
        }}
        centered
      >
        <Modal.Body>
          Are you sure you want to update the Order status of{" "}
          {currentorder ? currentorder.name : ""}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginLeft: "auto" }}
            variant="success"
            onClick={toggelOrderStatus.bind(this, currentorder)}
          >
            Change
          </Button>
        </Modal.Footer>
      </Modal>
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
                  <th>Order status</th>
                  <th className="tablecontent">Frequency</th>
                  <th className="tablecontent">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <Spinner
                    animation="border"
                    style={{ marginRight: "auto", marginLeft: "auto" }}
                  />
                ) : (
                  orders.map((order, index) => {
                    return (
                      <tr
                        onClick={() => {
                          setCurrentorder(order);
                          setShow(true);
                        }}
                      >
                        {selected ? (
                          <input
                            type="checkbox"
                            style={{ marginTop: "10px" }}
                            onClick={(e) => {
                              selectItem(e.target.checked, order);
                            }}
                          />
                        ) : (
                          ""
                        )}
                        <td>{index + 1}</td>
                        <td>{order.name}</td>
                        <td
                          onClick={() => {
                            setConfirm(true);
                            setShowpaid(true);
                          }}
                          style={{
                            color: order.orderStatus ? "green" : "red",
                          }}
                        >
                          {order.orderStatus !== undefined
                            ? order.orderStatus.toString()
                            : ""}
                        </td>
                        <td className="tablecontent">{order.frequency}</td>
                        <td className="tablecontent">{order.phoneNumber}</td>
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
