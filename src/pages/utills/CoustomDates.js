import moment from "moment";
var parser = require("cron-parser");

function CoustomArrayToCron(daysOfCoustom) {
  var tempString = "";
  daysOfCoustom.forEach((x) => {
    switch (x) {
      case "monday":
        tempString = tempString.concat("1,");
        break;
      case "tuesday":
        tempString = tempString.concat("2,");
        break;
      case "wednesday":
        tempString = tempString.concat("3,");
        break;
      case "thursday":
        tempString = tempString.concat("4,");
        break;
      case "friday":
        tempString = tempString.concat("5,");
        break;
      case "saturday":
        tempString = tempString.concat("6,");
        break;
      case "sunday":
        tempString = tempString.concat("0,");
        break;
    }
  });

  tempString = tempString.slice(0, -1);
  tempString = `0 0 * * ${tempString}`;

  return tempString;
}

function CreateNewDates(tempString) {
  var options = {
    currentDate: moment().add(2, "days").format("YYYY-MM-DD"),
    endDate: moment().date(31).format("YYYY-MM-DD"),
    iterator: true,
  };

  // console.log(options);

  var interval = parser.parseExpression(tempString, options);
  var temparr = [];

  while (true) {
    try {
      var obj = interval.next();
      temparr.push(moment(obj.value.toString()).format("YYYY-MM-DD"));
      //obj.done;
    } catch (e) {
      // console.log(temparr);
      break;
    }
  }

  return temparr;
}

export function UpdateCalendar(type, daysOfCoustom, oldDates) {
  var newCron;
  switch (type) {
    case "coustom":
      newCron = CoustomArrayToCron(daysOfCoustom);
      break;
    case "everyday":
      newCron = "0 0 * * *";
      break;
    case "alternate-day":
      newCron = "0 0 */2 * *";
      break;
  }

  var newDates = CreateNewDates(newCron);

  var mergedDates = [];
  var BreakException = {};

  try {
    oldDates.forEach((o) => {
      if (moment(o).isBefore(moment())) {
        mergedDates.push(o);
      } else {
        mergedDates = [...mergedDates, ...newDates];
        throw BreakException;
      }
    });
  } catch (err) {}

  return mergedDates;
}

export function CalculatePrice(mergedDates, quantity) {
  var pricing = 110 * mergedDates.length * quantity;
  return pricing;
}
