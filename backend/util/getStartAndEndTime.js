const tagalogMonthToEnglish = require("./tagalogMonthToEnglish");

const getStartAndEndTime = (text) => {
  const getStartDateString = (_text) => {
    _text = _text.toUpperCase();

    // Remove spaces that isn't a single space
    _text = _text.replace(/ {2,}/g, " ");

    // Select raw date string
    const petsaRegex = /PETSA : (.*?)\(/;
    let result = petsaRegex.exec(_text)[1];

    // Assume first word is month and translate to english
    let translatedMonth = tagalogMonthToEnglish(result.split(" ")[0]);

    // Replace first word with english month
    result = result.replace(/^\w+/, translatedMonth);

    return result;
  };

  const getStartTimeString = (_text) => {
    _text = _text.toUpperCase();

    // Remove spaces that isnt't a single space
    _text = _text.replace(/ {2,}/g, " ");

    let regex = /ORAS : (.*?)\(/;
    let result = regex.exec(_text)[1];
    result = result.replace(/\./g, "");
    result = result.split(" ");
    if (result[1] === "NN") result[1] = "PM";

    return `${result[0]} ${result[1]}`;
  };

  const getEndTime = (_text, startTime) => {
    _text = _text.toUpperCase();

    // Remove spaces that isnt't a single space
    _text = _text.replace(/ {2,}/g, " ");

    regex = /ORAS.*?\((.*?)\)/;
    let result = regex.exec(_text)[1];
    result = result.replace(/\ /g, "");

    regex = /(\d+)([A-Za-z])/g;
    const breakdown = [];
    let match;
    while ((match = regex.exec(result))) {
      breakdown.push({
        num: parseInt(match[1]),
        sign: match[2],
      });
    }

    let hoursToAdd = 0;
    let minutesToAdd = 0;

    for (const number of breakdown) {
      const { num, sign } = number;

      switch (sign) {
        case "O":
        case "H":
          hoursToAdd += num;
          break;
        case "M":
          minutesToAdd += num;
          break;
      }
    }

    startTime.setMinutes(startTime.getMinutes() + minutesToAdd);
    startTime.setHours(startTime.getHours() + hoursToAdd);

    return startTime;
  };

  const startDateString = getStartDateString(text);
  const startTimeString = getStartTimeString(text);
  const startDateTime = new Date(`${startDateString} ${startTimeString}`);
  const endDateTime = getEndTime(
    text,
    new Date(`${startDateString} ${startTimeString}`)
  );

  console.log(`returning ${startDateTime} and ${endDateTime}`);

  return { start: startDateTime, end: endDateTime };
};

module.exports = getStartAndEndTime;
