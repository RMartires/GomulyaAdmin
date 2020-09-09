import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const firebase = require("firebase");

var moment = require("moment"); // require

let filteredData = [];

class App extends Component {
  state = {
    data: null, //To Store initial data
    finalData: null, // To Store Final data which becomes a CSV
  };

  // Runs as soon as the website loads
  componentDidMount() {
    let data1 = []; // Array where the user order details are stored.

    // console.log(emails);

    firebase // Call to Firebase to retrieve all users who have placed an order
      .firestore()
      .collection("orders")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          data1.push(doc.data()); // Stores the user details in array data1
          // console.log(data1);
        });
        this.setState({
          data: data1, // changes the data property in state and adds all the retrieved array data into it.
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    // console.log(data);
    // console.log(data.length);
    console.log("loaded");

    // for (let i = 0; i < data.length; i++) {
    //   let todaysDate = moment().format("YYYY-MM-DD");

    //   data[i].calendar.forEach((x) => {
    //     if (x === todaysDate) {
    //       console.log(data[i].name);
    //     }
    //   });
    // }
  }

  // Runs after the data has been retrieved
  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      //START

      let data = this.state.data; //stores data of user orders that has been retrieved
      let data2 = []; // Orders with today as a delivery day are stored here
      let tempObj = {};
      // console.log(data);

      for (let i = 0; i < data.length; i++) {
        let todaysDate = moment().format("YYYY-MM-DD"); // Moment.js has been used here to determine todays date
        // let todaysDate = "2020-09-06";
        // console.log(todaysDate);

        //If orders delivery day is today, the loop below will add it into a new array data2 which has been defined above
        data[i].calendar.forEach((x) => {
          if (x === todaysDate) {
            tempObj = {
              phoneNumber: data[i].phoneNumber,
              name: data[i].name,
              address: data[i].address,
              quantity: data[i].quantity,
              months: data[i].months,
              startDate: data[i].startDate,
              frequency: data[i].frequency,
              days: data[i].days,
              price: data[i].price,
              email: data[i].email,
              calendar: data[i].calendar,
            };
            // console.log(data[i].calendar);
            data2.push(tempObj);
          }
        });
        // console.log(todaysDate);
      }

      // Once the sorting of which orders are to be delivered today is done, the new data with orders to be delivered today are stored in data2 array and that is updated in the state
      this.setState({
        finalData: data2,
      });

      // console.log(data2);
      // The function below is called and the final array of sorted orders is passed into it. This function generates the .csv file and automatically downloads it
      this.finalFunction(data2);
      // //END
    }
  }

  //This file converts array data into CSV and downloads it automatically
  finalFunction = (data2) => {
    const { convertArrayToCSV } = require("convert-array-to-csv");
    const converter = require("convert-array-to-csv");

    // const dataObjects = [
    //   {
    //     number: 1,
    //     first: "Mark",
    //     last: "Otto",
    //     handle: "@mdo",
    //     calendar: ["dsds", "dsds"],
    //   },
    //   {
    //     number: 2,
    //     first: "Jacob",
    //     last: "Thornton",
    //     handle: "@fat",
    //     calendar: ["dsds", "dsds"],
    //   },
    //   {
    //     number: 3,
    //     first: "Larry",
    //     last: "the Bird",
    //     handle: "@twitter",
    //     calendar: ["dsds", "dsds"],
    //   },
    // ];

    /*
  const csvFromArrayOfObjects  = 'number,first,last,handle\n1,Mark,Otto,@mdo\n2,Jacob,Thornton,@fat\n3,Larry,the Bird,@twitter\n';
*/
    const csvFromArrayOfObjects = convertArrayToCSV(data2);

    // console.log(csvFromArrayOfObjects);

    // console.log(data2);

    var encodedUri = encodeURI(csvFromArrayOfObjects);
    // var link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", "my_data.csv");
    // document.body.appendChild(link); // Required for FF

    // link.click(); // This will download the data file named "my_data.csv".

    var hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:text/csv;charset=utf-8," + encodeURI(csvFromArrayOfObjects);
    hiddenElement.target = "_blank";
    hiddenElement.download = "people.csv";
    hiddenElement.click();
  };

  render() {
    return (
      <div>
        <div id="dat"> hi </div>
        <div> hi </div>
        <button onClick="download_csv()">Download CSV</button>
      </div>
    );
  }
}

export default App;
