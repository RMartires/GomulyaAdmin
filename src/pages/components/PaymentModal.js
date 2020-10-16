import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment";
import { useForm } from "react-hook-form";
import "./Users.css";
import "react-calendar/dist/Calendar.css";
const firebase = require("firebase");

export default function PaymentModal(props) {
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
    // send.frequency = data.frequency;
    send.paymentMethod = data?.paymentMethod;
    // send.quantity = data.quantity;
    send.price = data.price;
    send.phoneNumber = data.phoneNumber;
    send.paidAmount = data?.paidAmount;
    send.remainingAmount = data?.price - data?.paidAmount;
    send.paymentStatus = send?.remainingAmount === 0 ? "done" : "incomplete";
    send.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    if (send.paymentStatus === "done") {
      fetch(
        `https://us-central1-firstproject-3ca46.cloudfunctions.net/subscribeToTopic?topic=PaymentDue&regToken=${send?.regToken}&type=unsubscribe`
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(
        `https://us-central1-firstproject-3ca46.cloudfunctions.net/subscribeToTopic?topic=PaymentDue&regToken=${send?.regToken}&type=subscribe`
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
            {/* <label>Payment status</label>
              <select
                className="select-css"
                name="paymentStatus"
                defaultValue={props.order?.paymentStatus}
                ref={register({
                  required: true,
                })}
              >
                <option value={true}>paid</option>
                <option value={false}>pending</option>
              </select> */}
            {errors.orderStatus && <p>This field is required</p>}
            <label>Total</label>
            <input
              name="price"
              defaultValue={props.order?.price}
              ref={register({
                required: true,
              })}
            ></input>
            {errors.price && <p>This field is required</p>}
            <label>Paid Amount</label>
            <input
              name="paidAmount"
              defaultValue={props.order?.paidAmount}
              ref={register({
                required: true,
              })}
            ></input>
            {errors.paidAmount && <p>This field is required</p>}
            <label>Payment Method</label>
            <input
              name="paymentMethod"
              defaultValue={props.order?.paymentMethod}
              ref={register({
                required: true,
              })}
            ></input>
            {errors.paymentMethod && <p>This field is required</p>}
            {/* <label>Quantity</label>
              <input
                name="quantity"
                defaultValue={props.order?.quantity}
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
              {errors.frequency && <p>This field is required</p>} */}
            <label>Contact No.</label>
            <input
              name="phoneNumber"
              defaultValue={props.order.phoneNumber}
              ref={register({
                required: true,
              })}
            />
            {errors.phoneNumber && <p>This field is required</p>}
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
          <h5>
            Payment status: {props.order?.paymentStatus ? "paid" : "pending"}
          </h5>
          <h5>Total: {props.order.price}</h5>
          <h5>Paid Amount: {props.order?.paidAmount}</h5>
          <h5>Remaining Amount: {props.order?.remainingAmount}</h5>
          <h5>Payment Mehod: {props.order?.paymentAmount}</h5>
          <h5>Quantity: {props.order?.quantity}</h5>
          <h5>Frequency: {props.order?.frequency}</h5>
          <h5>Contact no.: {props.order.phoneNumber}</h5>
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
