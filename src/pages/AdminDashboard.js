import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import Users from "./components/Users";

export default class AdminDashboard extends Component {
  render() {
    return (
      <div>
        <Navbar bg="light">
          <Navbar.Brand href="#users">Users</Navbar.Brand>
          <Navbar.Brand href="#orders">Orders</Navbar.Brand>
          <Button style={{ marginLeft: "auto" }}>Email</Button>
          <Button style={{ marginLeft: "10px" }}>Notify</Button>
        </Navbar>
        <br />
        <Users />
      </div>
    );
  }
}
