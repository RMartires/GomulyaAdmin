import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import UserTable from "./components/UserTable";
import OrderTable from "./components/OrderTable";

export default class AdminDashboard extends Component {
  state = {
    UserTable: true,
  };

  render() {
    return (
      <div>
        <Navbar bg="light">
          <Button
            variant="light"
            onClick={() => {
              this.setState({ UserTable: true });
            }}
          >
            Users
          </Button>
          <Button
            variant="light"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              this.setState({ UserTable: false });
            }}
          >
            Orders
          </Button>
          <Button style={{ marginLeft: "auto" }}>Email</Button>
          <Button style={{ marginLeft: "10px" }}>Notify</Button>
        </Navbar>
        <br />
        {this.state.UserTable ? <UserTable /> : <OrderTable />}
      </div>
    );
  }
}
