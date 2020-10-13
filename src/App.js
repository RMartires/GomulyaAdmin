import React, { Component } from "react";
import "./App.css";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import FAdminDashboard from "./pages/AdminDashboard";

class App extends Component {
  state = {
    Table: "user",
  };

  setTable = (table) => {
    this.setState({ Table: table });
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/:page" component={FAdminDashboard} />
            <Route
              path="/"
              component={() => {
                return <Redirect to="/user" />;
              }}
            />
            {/* <Route
              path="/pending"
              component={() => {
                return <AdminDashboard Table={this.state.Table} setTable={this.setTable}/>;
              }}
            />
            <Route
              path="/order"
              component={() => {
                return <AdminDashboard Table={this.state.Table} setTable={this.setTable}/>;
              }}
            /> */}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
