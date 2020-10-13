import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";
import { useForm } from "react-hook-form";
import "./Users.css";
import "react-calendar/dist/Calendar.css";
const firebase = require("firebase");

export default function PendingModel(props) {
  var [edit, setEdit] = useState(false);
  const { register, handleSubmit, errors } = useForm();

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
    var send = props.order;
    send.frequency = data.frequency;
    send.orderStatus = data.orderStatus === "true" ? true : false;
    send.quantity = data.quantity;
    send.startDate = data.startDate;
    send.phoneNumber = data.phoneNumber;
    send.address = data.address;
    send.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
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
          <Modal.Body>
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
                <option value={true}>true</option>
                <option value={false}>false</option>
              </select>
              {errors.orderStatus && <p>This field is required</p>}
              <label>Quantity</label>
              <input
                name="quantity"
                defaultValue={props.order.quantity}
                ref={register({
                  required: true,
                })}
              />
              {errors.quantity && <p>This field is required</p>}
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
        ) 
      : (
        <Modal.Body>
          <h5>order status: {props.order.orderStatus.toString()}</h5>
          <h5>quantity: {props.order.quantity}</h5>
          <h5>frequency: {props.order.frequency}</h5>
          <h5>startdate: {props.order.startDate}</h5>
          <h5>contact no.: {props.order.phoneNumber}</h5>
          <h5>address: {props.order.address}</h5>
          <h5>
            Created At:{" "}
            {props.order.createdAt ? `${moment(props.order.createdAt.toDate()).format("DD MM YYYY, hh:mm:ss")}` : "-"}
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
