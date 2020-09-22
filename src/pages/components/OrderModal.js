import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";
import { useForm } from "react-hook-form";
import "./Users.css";
import "react-calendar/dist/Calendar.css";
const firebase = require("firebase");

export default function OrderModel(props) {
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
    setCalendar(data);
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

  const deleteOrder = async () => {
    await firebase
      .firestore()
      .collection("orders")
      .doc(props.order.phoneNumber)
      .delete();
    setEdit(false);
    props.getOrders();
    props.setShow(false);
  };

  const onSubmit = async (data) => {
    var send = props.order;
    send.frequency = data.frequency;
    send.orderStatus = data.orderStatus === "true" ? true : false;
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
    setEdit(false);
    props.getOrders();
    props.setCurrentorder(data);
    props.setShow(false);
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
                <option value={true}>true</option>
                <option value={false}>false</option>
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
            <Button
              variant="danger"
              onClick={deleteOrder.bind(this)}
              style={{ marginTop: "10px" }}
            >
              Delete
            </Button>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <label>calendar</label>
            <Calendar
              showNavigation={false}
              value={new Date()}
              onChange={(value) => chnageCalendar(value)}
              minDate={moment().add(2, "days")._d}
              maxDate={moment().add(1, "month").date(1).subtract(1, "day")._d}
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
          <Calendar
            showNavigation={false}
            value={new Date()}
            minDate={moment().add(2, "days")._d}
            maxDate={moment().add(1, "month").date(1).subtract(1, "day")._d}
          />
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
