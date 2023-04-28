const tagalogMonthToEnglish = (month) => {
  month = month.toUpperCase();
  const code = month.substring(0, 3);

  switch (code) {
    case "ENE":
    case "JAN":
      return "January";
    case "PEB":
    case "FEB":
      return "February";
    case "MAR":
      return "March";
    case "ABR":
    case "APR":
      return "April";
    case "MAY":
      return "May";
    case "HUN":
    case "JUN":
      return "June";
    case "HUL":
    case "JUL":
      return "July";
    case "AGO":
    case "AUG":
      return "August";
    case "SET":
    case "SEP":
      return "September";
    case "OKT":
    case "OCT":
      return "October";
    case "NOB":
    case "NOV":
      return "November";
    case "DIS":
    case "DEC":
      return "December";
  }
};

module.exports = tagalogMonthToEnglish;
