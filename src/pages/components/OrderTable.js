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
import { useForm } from "react-hook-form";
import "./Users.css";
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

  async function toggelPaidStatus(order) {
    if (order.paid === "pending") {
      order.paid = "complete";
    } else {
      order.paid = "pending";
    }
    await firebase.firestore().collection("orders").doc(order.email).set(order);
    getOrders();
    setShowpaid(false);
    setShow(false);
    setConfirm(false);
  }

  return (
    <Container fluid>
      {currentorder ? (
        <OrderModel
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
        }}
        centered
      >
        <Modal.Body>
          Are you sure you want to update the paid status of{" "}
          {currentorder ? currentorder.name : ""}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginLeft: "auto" }}
            variant="success"
            onClick={toggelPaidStatus.bind(this, currentorder)}
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
                <th>Paid</th>
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
                          color: order.paid === "complete" ? "green" : "red",
                        }}
                      >
                        {order.paid}
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

function OrderModel(props) {
  var [edit, setEdit] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    //console.log(data);
    data.name = props.order.name;
    await firebase
      .firestore()
      .collection("orders")
      .doc(props.order.email)
      .set(data);
    props.getOrders();
    props.setCurrentorder(data);
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
        <h4>{props.order.name}</h4>
      </Modal.Header>
      {edit ? (
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>quantity</label>
            <input
              name="quantity"
              defaultValue={props.order.quantity}
              ref={register({ required: true, pattern: /[0-9]/ })}
            />
            {errors.quantity && (
              <p>This field is required and should be an integer</p>
            )}
            <label>price</label>
            <input
              name="price"
              defaultValue={props.order.price}
              ref={register({
                required: true,
                pattern: /[0-9]/,
              })}
            />
            {errors.price && <p>This field is required</p>}
            <label>paid</label>
            <input
              name="paid"
              defaultValue={props.order.paid}
              ref={register({
                required: true,
              })}
            />
            {errors.paid && <p>This field is required</p>}
            <label>frequency</label>
            <input
              name="frequency"
              defaultValue={props.order.frequency}
              ref={register({
                required: true,
              })}
            />
            {errors.frequency && <p>This field is required</p>}
            <label>days</label>
            <input
              name="days"
              defaultValue={props.order.days}
              ref={register({
                required: true,
              })}
            />
            {errors.days && <p>This field is required</p>}
            <label>months</label>
            <input
              name="months"
              defaultValue={props.order.months}
              ref={register({
                required: true,
              })}
            />
            {errors.months && <p>This field is required</p>}
            <label>startdate</label>
            <input
              name="startdate"
              defaultValue={props.order.startdate}
              ref={register({
                required: true,
              })}
            />
            {errors.startdate && <p>This field is required</p>}
            {props.order.DayOfWeekForWeekly ? (
              <div>
                <label>DayOfWeekForWeekly</label>
                <input
                  name="DayOfWeekForWeekly"
                  defaultValue={props.order.DayOfWeekForWeekly}
                  ref={register({
                    required: true,
                  })}
                />
                {errors.DayOfWeekForWeekly && <p>This field is required</p>}
              </div>
            ) : (
              ""
            )}
            <label>calendar</label>
            <input
              name="calendar"
              defaultValue={props.order.calendar}
              ref={register({
                required: true,
              })}
            />
            {errors.calendar && <p>This field is required</p>}
            <Button type="submit">Update</Button>
          </form>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h5>paid: {props.order.paid}</h5>
          <h5>price: {props.order.price}</h5>
          <h5>quantity: {props.order.quantity}</h5>
          <h5>frequency: {props.order.frequency}</h5>
          <h5>months: {props.order.months}</h5>
          <h5>days: {props.order.days}</h5>
          {props.order.DayOfWeekForWeekly ? (
            <h5>DayOfWeekForWeekly: {props.order.DayOfWeekForWeekly}</h5>
          ) : (
            ""
          )}
          <h5>startdate: {props.order.startdate}</h5>
          <h5>calendar: {props.order.calendar}</h5>
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
