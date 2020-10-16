import React, { Component, useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import BlockUi from "react-block-ui";
import { useForm } from "react-hook-form";
import "react-block-ui/style.css";
const firebase = require("firebase");

export default function SignIn(props) {
  const { register, handleSubmit, errors } = useForm();
  const [blocking, setBlocking] = useState(false);
  const [signerr, Setsignerr] = useState(false);

  const onSubmit = async (data) => {
    var done = false;
    try {
      setBlocking(true);
      var querySnapshot = await firebase
        .firestore()
        .collection("adminUsers")
        .get();

      querySnapshot.forEach((doc) => {
        var temp = doc.data();
        if (
          temp.username === data.username &&
          temp.password === data.password
        ) {
          done = true;
        }
      });

      setBlocking(false);

      if (!done) {
        Setsignerr(true);
      } else {
        props.setToken(data);
        props.history.push("/user");
        Setsignerr(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BlockUi tag="div" blocking={blocking} message="Signing in, please wait">
      <Container fluid style={{ height: "100vh" }}>
        <Row fluid style={{ height: "100vh" }}>
          <Col
            sm={{ span: 6, offset: 3 }}
            style={{ height: "min-content", alignSelf: "center" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 style={{ color: "white" }}>Sign In</h3>
              <label>Username</label>
              <input
                name="username"
                ref={register({
                  required: true,
                })}
              />
              {errors.username && <p>This field is required</p>}
              <label>Password</label>
              <input
                name="password"
                ref={register({
                  required: true,
                })}
                type="password"
              />
              {errors.password && <p>This field is required</p>}
              <Button type="submit">SignIn</Button>
            </form>
            {signerr && <p>Username or Password is wrong!</p>}
          </Col>
        </Row>
      </Container>
    </BlockUi>
  );
}
