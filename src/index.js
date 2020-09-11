import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";

const firebase = require("firebase");

require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyDYkbXOuRdWaiQY-aMNN3CbNN0zX4IQpiU",
  authDomain: "firstproject-3ca46.firebaseapp.com",
  databaseURL: "https://firstproject-3ca46.firebaseio.com",
  projectId: "firstproject-3ca46",
  storageBucket: "firstproject-3ca46.appspot.com",
  messagingSenderId: "289861439610",
  appId: "1:289861439610:web:671ff84c634a348e1c2bc3",
  measurementId: "G-3W7CEELLPR",
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
