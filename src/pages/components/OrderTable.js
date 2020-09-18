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
import Calendar from "react-calendar";
import moment from "moment";
import "./Users.css";
import "react-calendar/dist/Calendar.css";
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

function OrderModel(props) {
  var [edit, setEdit] = useState(false);
  var [editcalendar, setEditcalendar] = useState(false);
  var [calendar, setCalendar] = useState(props.order.calendar);
  const { register, handleSubmit, errors } = useForm();

  const setSelectedDates = (data) => {
    data.forEach((d) => {
      var element = document.querySelector(
        `[aria-label="${moment(d).format("MMMM D, YYYY")}"]`
      );
      if (element) {
        var tempCN = element.parentElement.className;
        tempCN =
          tempCN.split("react-calendar__tile")[0] +
          " " +
          tempCN.split("react-calendar__tile")[1];
        element.parentElement.className = tempCN + " selected";
      }
    });
  };

  const setClassSelected = (d) => {
    var element = document.querySelector(
      `[aria-label="${moment(d).format("MMMM D, YYYY")}"]`
    );
    var defaultCN = "react-calendar__month-view__days__day";
    var selctedCN = "react-calendar__month-view__days__day selected";

    if (element) {
      if (element.parentElement.className.includes("selected")) {
        element.parentElement.className = defaultCN;
      } else {
        element.parentElement.className = selctedCN;
      }
    }
  };

  useEffect(() => {
    try {
      setSelectedDates(props.order.calendar);
    } catch (err) {}
    setCalendar(props.order.calendar);
  }, [props, editcalendar, edit]);

  const chnageCalendar = (date) => {
    var tempdate = moment(date).format("YYYY-MM-D");
    var tempcalendar = calendar;
    if (calendar.includes(tempdate)) {
      tempcalendar = tempcalendar.filter((x) => x !== tempdate);
      setCalendar(tempcalendar);
    } else {
      tempcalendar.push(tempdate);
      setCalendar(tempcalendar);
    }
    setClassSelected(tempdate);
    //console.log(tempcalendar);
  };

  const onSubmit = async (data) => {
    console.log(props.order);
    var send = props.order;
    send.frequency = data.frequency;
    send.orderStatus = data.orderStatus;
    send.paid = data.paid;
    send.price = data.price;
    send.quantity = data.quantity;
    send.startDate = data.startDate;
    console.log(send);
    await firebase
      .firestore()
      .collection("orders")
      .doc(props.order.phoneNumber)
      .set(send);
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
        !editcalendar ? (
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
              <label>order status</label>
              <select
                className="select-css"
                name="orderStatus"
                defaultValue={props.order.orderStatus}
                ref={register({
                  required: true,
                })}
              >
                <option value={"true"}>true</option>
                <option value={"false"}>false</option>
              </select>
              {errors.orderStatus && <p>This field is required</p>}
              <label>paid status</label>
              <select
                name="paid"
                className="select-css"
                defaultValue={props.order.paid}
                ref={register({
                  required: true,
                })}
              >
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
              {errors.orderStatus && <p>This field is required</p>}
              <label>frequency</label>
              <input
                name="frequency"
                defaultValue={props.order.frequency}
                ref={register({
                  required: true,
                })}
              />
              {errors.frequency && <p>This field is required</p>}
              <label>startdate</label>
              <input
                name="startDate"
                defaultValue={props.order.startDate}
                ref={register({
                  required: true,
                })}
              />
              {errors.startDate && <p>This field is required</p>}
              {/* {props.order.DayOfWeekForWeekly ? (
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
            {errors.months && <p>This field is required</p>} */}
              <Button type="submit">Update</Button>
            </form>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <label>calendar</label>
            <Calendar
              showNavigation={false}
              value={new Date()}
              onChange={(value) => chnageCalendar(value)}
            />
            <Button
              variant="success"
              onClick={async () => {
                var data = props.order;
                data.calendar = calendar;
                await firebase
                  .firestore()
                  .collection("orders")
                  .doc(props.order.phoneNumber)
                  .set(data);
                props.getOrders();
                setEditcalendar(false);
                setEdit(false);
              }}
              style={{ marginTop: "10px" }}
            >
              Save Changes
            </Button>
          </Modal.Body>
        )
      ) : (
        <Modal.Body>
          <h5>paid status: {props.order.paid}</h5>
          <h5>order status: {props.order.orderStatus.toString()}</h5>
          <h5>price: {props.order.price}</h5>
          <h5>quantity: {props.order.quantity}</h5>
          <h5>frequency: {props.order.frequency}</h5>
          <h5>startdate: {props.order.startDate}</h5>
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
          <Calendar showNavigation={false} value={new Date()} />
          <div style={{ marginLeft: "auto", width: "min-content" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setEdit(true);
                setEditcalendar(true);
              }}
            >
              Edit Calender
            </Button>
          </div>
          {/* <h5>months: {props.order.months}</h5>
          <h5>days: {props.order.days}</h5>
          {props.order.DayOfWeekForWeekly ? (
            <h5>DayOfWeekForWeekly: {props.order.DayOfWeekForWeekly}</h5>
          ) : (
            ""
          )} */}
        </Modal.Body>
      )}
    </Modal>
  );
}
