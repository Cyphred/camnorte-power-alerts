require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const StartScrapers = require("./scrapers/startScrapers");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const ScheduledInterruptionRoutes = require("./routes/scheduled");

app.use("/api/power-interruptions/scheduled", ScheduledInterruptionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
    });

    StartScrapers();
  })
  .catch((error) => {
    console.log(error);
  });
