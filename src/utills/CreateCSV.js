var moment = require("moment");
const { convertArrayToCSV } = require("convert-array-to-csv");
const firebase = require("firebase");

module.exports.CreateOrderCSV = async () => {
  var data = [];
  var querySnapshot = await firebase.firestore().collection("orders").get();
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  let northData2 = [];
  let southData2 = [];
  let tempObj = {};
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
          startDate: data[i].startDate,
          frequency: data[i].frequency,
          price: data[i].price,
          email: data[i].email,
          calendar: data[i].calendar,
        };
        // console.log(data[i].calendar);
        if (data[i].district) {
          if (data[i].district === "North-Goa") {
            northData2.push(tempObj);
          } else {
            southData2.push(tempObj);
          }
        }
      }
    });
    // console.log(todaysDate);
  }
  console.log(northData2);
  console.log(southData2);
  var northCSV, southCSV;
  var arr = [];
  if (northData2.length > 0) {
    northCSV = convertArrayToCSV(northData2);
    arr.push(northCSV);
  } else {
    arr.push(false);
  }
  if (southData2.length > 0) {
    southCSV = convertArrayToCSV(southData2);
    arr.push(southCSV);
  } else {
    arr.push(false);
  }
  return arr;
};
