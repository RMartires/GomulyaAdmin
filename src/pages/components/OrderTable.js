import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
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

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    var temporders = [];
    firebase
      .firestore()
      .collection("orders")
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
                orders.map((order) => {
                  return (
                    <tr
                      onClick={() => {
                        setCurrentorder(order);
                        setShow(true);
                      }}
                    >
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
