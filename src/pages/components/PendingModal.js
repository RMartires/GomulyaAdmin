import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";
import { useForm } from "react-hook-form";
import { Multiselect } from "multiselect-react-dropdown";
import { UpdateCalendar, CalculatePrice } from "../utills/CoustomDates";
import "./Users.css";
import "react-calendar/dist/Calendar.css";
const firebase = require("firebase");
var parser = require("cron-parser");

export default function PendingModel(props) {
  var [edit, setEdit] = useState(false);
  var [coustomDays, setCoustomDays] = useState(() => {
    return props.order.daysOfCustom.map((x, index) => {
      return { name: x, id: index + 1 };
    });
  });
  var [price, setPrice] = useState(props.order.price);
  var [calendar, setCalendar] = useState(props.order.calendar);
  const { register, handleSubmit, watch, errors } = useForm();
  var watchFrequency = watch("frequency", props.order.frequency);
  var watchQty = watch("quantity", props.order.quantity);

  useEffect(() => {
    if (props.order.daysOfCustom) {
      setCoustomDays(() => {
        return props.order.daysOfCustom.map((x, index) => {
          return { name: x, id: index + 1 };
        });
      });
    }
    setPrice(props.order.price);
    setCalendar(props.order.calendar);
  }, [props.show]);

  useEffect(() => {
    switch (watchFrequency) {
      case "everyday":
        UpdateTempPrice("everyday", [], props.order.calendar);
        break;
      case "alternate-day":
        UpdateTempPrice("alternate-day", [], props.order.calendar);
        break;
    }
    // console.log(watchFrequency);
  }, [watchFrequency, watchQty]);

  const UpdateTempPrice = (type, data) => {
    console.log(data);
    if (data.length > 0 && type == "coustom") {
      var tempCD = data.map((x, index) => {
        return x.name;
      });
      var mergedDates = UpdateCalendar(type, tempCD, props.order.calendar);
      var tempprice = CalculatePrice(mergedDates, watchQty);
      setPrice(tempprice);
      setCalendar(mergedDates);
    } else {
      var mergedDates = UpdateCalendar(type, [], props.order.calendar);
      var tempprice = CalculatePrice(mergedDates, watchQty);
      setPrice(tempprice);
      setCalendar(mergedDates);
    }
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
    console.log(data);
    var CD = coustomDays.map((x) => {
      return x.name;
    });
    var send = props.order;
    send.frequency = data.frequency;
    send.daysOfCustom = CD;
    send.orderStatus = data.orderStatus === "true" ? true : false;
    send.quantity = data.quantity;
    // send.startDate = data.startDate;
    send.calendar = calendar;
    send.price = price;
    //
    send.phoneNumber = data.phoneNumber;
    send.address = data.address;
    send.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await firebase
      .firestore()
      .collection("orders")
      .doc(props.order.phoneNumber)
      .set(send);
    setEdit(false);
    setCoustomDays([]);
    setPrice(undefined);
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
        setCoustomDays([]);
        setPrice(undefined);
      }}
      centered
    >
      <Modal.Header closeButton>
        <h4>{props.order.name}</h4>
      </Modal.Header>
      {edit ? (
        <Modal.Body>
          <h5>{`price :${price}`}</h5>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>order status</label>
            <select
              className="select-css"
              name="orderStatus"
              defaultValue={props.order.orderStatus}
              ref={register({
                required: true,
              })}
            >
              <option value={true}>Confirmed</option>
              <option value={false}>Pending</option>
            </select>
            {errors.orderStatus && <p>This field is required</p>}
            <label style={{ display: "block" }}>Quantity</label>
            <select
              style={{ display: "block" }}
              className="select-css"
              name="quantity"
              defaultValue={props.order.quantity}
              ref={register({
                required: true,
              })}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
            {errors.quantity && <p>This field is required</p>}
            <label style={{ display: "block" }}>frequency</label>
            <select
              style={{ display: "block" }}
              className="select-css"
              name="frequency"
              defaultValue={props.order.frequency}
              ref={register({
                required: true,
              })}
            >
              <option value="everyday">Everyday</option>
              <option value="alternate-day">Alternate Day</option>
              <option value="custom">Custom</option>
            </select>
            {watchFrequency === "custom" ? (
              <Multiselect
                options={[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((x, index) => {
                  return { name: x, id: index + 1 };
                })}
                displayValue="name"
                onSelect={(data) => {
                  setCoustomDays(data);
                  UpdateTempPrice("coustom", data);
                }}
                onRemove={(data) => {
                  if (!data.length < 1) {
                    setCoustomDays(data);
                    UpdateTempPrice("coustom", data);
                  }
                }}
                selectedValues={coustomDays}
              />
            ) : (
              ""
            )}
            {errors.frequency && <p>This field is required</p>}
            {/* <label>startdate</label>
            <input
              name="startDate"
              defaultValue={props.order.startDate}
              ref={register({
                required: true,
              })}
            />
            {errors.startDate && <p>This field is required</p>} */}
            <label>Contact No.</label>
            <input
              name="phoneNumber"
              defaultValue={props.order.phoneNumber}
              ref={register({
                required: true,
              })}
            />
            {errors.phoneNumber && <p>This field is required</p>}
            <label>Address</label>
            <input
              name="address"
              defaultValue={props.order.address}
              ref={register({
                required: true,
              })}
            />
            {errors.address && <p>This field is required</p>}
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
          <h5>order status: {props.order.orderStatus.toString()}</h5>
          <h5>quantity: {props.order.quantity}</h5>
          <h5>frequency: {props.order.frequency}</h5>
          <h5>startdate: {props.order.startDate}</h5>
          <h5>contact no.: {props.order.phoneNumber}</h5>
          <h5>address: {props.order.address}</h5>
          <h5>
            Created At:{" "}
            {props.order.createdAt
              ? `${moment(props.order.createdAt.toDate()).format(
                  "DD MM YYYY, hh:mm:ss"
                )}`
              : "-"}
          </h5>
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
