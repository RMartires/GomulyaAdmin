import React, { Component } from "react";
import "./App.css";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import FAdminDashboard from "./pages/AdminDashboard";
import Cookies from "js-cookie";
import SignIn from "./pages/SignIn";

class App extends Component {
  state = {
    Table: "user",
  };

  setTable = (table) => {
    this.setState({ Table: table });
  };

  componentDidMount() {
    var authtoken = Cookies.get("authToken");
    this.setState({ authtoken: authtoken });
  }

  render() {
    const setToken = (data) => {
      if (data) {
        var token = JSON.stringify(data);
        Cookies.set("authToken", `${token}`);
        this.setState({ authtoken: token });
      } else {
        Cookies.remove("authToken");
        this.setState({ authtoken: undefined });
      }
    };

    return (
      <div>
        <BrowserRouter>
          {this.state.authtoken ? (
            <Switch>
              <Route
                path="/:page"
                component={() => {
                  return <FAdminDashboard setToken={setToken} />;
                }}
              />
              <Route
                path="/"
                component={() => {
                  return <Redirect to="/user" />;
                }}
              />
            </Switch>
          ) : (
            <Switch>
              <Route
                path="/"
                component={() => {
                  return <SignIn setToken={setToken} />;
                }}
              />
            </Switch>
          )}
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
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
