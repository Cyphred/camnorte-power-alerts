const getAuthorFromTitle = (title) => {
  title = title.toUpperCase();

  if (title.includes("CANORECO")) {
    return "CANORECO";
  } else if (title.includes("NATIONAL GRID CORPORATION OF THE PHILIPPINES")) {
    return "NGCP";
  }
};

const generateTagalogDateTimeRange = (start, end) => {
  const times = {
    start: "",
    end: "",
  };

  times.start = start.toLocaleDateString("tl-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // Check if the end date is the following day
  if (end.getDate() !== start.getDate()) {
    times.end = end.toLocaleDateString("tl-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    times.end = end.toLocaleTimeString("tl-PH", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  const diffMs = end.getTime() - start.getTime(); // get time difference in milliseconds
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // convert to hours
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // convert remainder to minutes

  let oras, minuto;
  if (diffHours > 0) {
    oras = `${diffHours} oras`;
  }
  if (diffMins > 0) {
    minuto = `${diffMins} minuto`;
  }

  let duration = "(";

  if (oras && minuto) {
    duration += `${oras}, ${minuto})`;
  } else if (oras) {
    duration += `${oras})`;
  } else if (minuto) {
    duration += `${minuto})`;
  }

  const result = `${times.start} hanggang ${times.end} ${duration}`;
  return result;
};

const optimizeTextForTwitter = (data) => {
  const { title, date_posted, short_url } = data;

  let optimized = "";

  // Add author to heading
  const author = getAuthorFromTitle(title);
  if (author) {
    optimized += `${author} `;
  }

  // Generate time and date posted
  const post_time = date_posted.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "numeric",
  });

  const post_date = date_posted.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  optimized += `Advisory\n\n`;
  optimized += `Posted on ${post_time}, ${post_date}.\n`;
  optimized += `Source: CANORECO Official Website: ${short_url}`;

  return optimized;
};

module.exports = optimizeTextForTwitter;
