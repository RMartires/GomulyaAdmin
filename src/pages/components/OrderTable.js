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

  useEffect(() => {
    getOrders();
  }, [sortby]);

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
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>#</th>
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
        </Col>
      </Row>
    </Container>
  );
}
