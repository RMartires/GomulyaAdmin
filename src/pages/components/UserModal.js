import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Users.css";
const firebase = require("firebase");

export default function UserModel(props) {
  var [edit, setEdit] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    data.name = props.user.name;
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    await firebase
      .firestore()
      .collection("users")
      .doc(props.user.phoneNumber)
      .set(data);
    props.getUsers();
    props.setCurrentuser(data);
    setEdit(false);
  };

  const deleteUser = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(props.user.phoneNumber)
      .delete();
    props.getUsers();
    setEdit(false);
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
        <h4>{props.user.name}</h4>
      </Modal.Header>
      {edit ? (
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              defaultValue={props.user.phoneNumber}
              ref={register({ required: true })}
            />
            {errors.phoneNumber && (
              <p>This field is required and maxLength 10</p>
            )}
            <label>Email</label>
            <input
              name="email"
              defaultValue={props.user.email}
              ref={register({
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              })}
            />
            {errors.email && (
              <p>This field is required and should be in a email format</p>
            )}
            <label>Address</label>
            <input
              name="address"
              defaultValue={props.user.address}
              ref={register({
                required: true,
              })}
              type="text"
            />
            {errors.address && <p>This field is required</p>}
            <label>City</label>
            <input
              name="city"
              defaultValue={props.user.city}
              ref={register({
                required: true,
              })}
            />
            {errors.city && <p>This field is required</p>}
            <Button type="submit">Update</Button>
          </form>
          <Button
            variant="danger"
            onClick={deleteUser.bind(this)}
            style={{ marginTop: "10px" }}
          >
            Delete
          </Button>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <h5>Phone Number: {props.user.phoneNumber}</h5>
          <h5>Email: {props.user.email}</h5>
          <h5>Address: {props.user.address}</h5>
          <h5>City: {props.user.city}</h5>
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
