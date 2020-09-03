import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const firebase = require("firebase");

var moment = require("moment"); // require

let filteredData = [];

class App extends Component {
  state = {
    data: null,
    finalData: null,
  };

  componentDidMount() {
    let emails = [];
    let data1 = [];

    firebase
      .firestore()
      .collection("orders")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.data().email);
          emails.push(doc.data().email);
        });
      });

    // console.log(emails);

    firebase
      .firestore()
      .collection("orders")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          data1.push(doc.data());
          // console.log(data1);
        });
        this.setState({
          data: data1,
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    // console.log(data);
    // console.log(data.length);

    // for (let i = 0; i < data.length; i++) {
    //   let todaysDate = moment().format("YYYY-MM-DD");

    //   data[i].calendar.forEach((x) => {
    //     if (x === todaysDate) {
    //       console.log(data[i].name);
    //     }
    //   });
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      //START

      let data = this.state.data;
      let data2 = [];
      let tempObj = {};
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        // let todaysDate = moment().format("YYYY-MM-DD");
        let todaysDate = "2020-09-12";
        // console.log(data.length);
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
            console.log(data[i].calendar);
            data2.push(tempObj);
          }
        });
        // console.log(todaysDate);
      }

      this.setState({
        finalData: data2,
      });

      // console.log(data2);
      this.finalFunction(data2);
      // //END
    }
  }

  finalFunction = (data2) => {
    const { convertArrayToCSV } = require("convert-array-to-csv");
    const converter = require("convert-array-to-csv");

    const dataObjects = [
      {
        number: 1,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
        calendar: ["dsds", "dsds"],
      },
      {
        number: 2,
        first: "Jacob",
        last: "Thornton",
        handle: "@fat",
        calendar: ["dsds", "dsds"],
      },
      {
        number: 3,
        first: "Larry",
        last: "the Bird",
        handle: "@twitter",
        calendar: ["dsds", "dsds"],
      },
    ];

    /*
  const csvFromArrayOfObjects  = 'number,first,last,handle\n1,Mark,Otto,@mdo\n2,Jacob,Thornton,@fat\n3,Larry,the Bird,@twitter\n';
*/
    const csvFromArrayOfObjects = convertArrayToCSV(data2);

    console.log(csvFromArrayOfObjects);

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
