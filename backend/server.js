require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");

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
    // Wait for connection to RabbitMQ
    console.log("Waiting to connect to RabbitMQ");
    return connectToRabbitMQ();
  })
  .then((connection) => {
    // Setup RabbitMQ Consumers
    const { startConsumers } = require("./rabbitmq");
    startConsumers(connection);
  })
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

async function connectToRabbitMQ() {
  let connection;
  while (true) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URI);
      console.log("Connected to RabbitMQ");
      break;
    } catch (error) {
      console.log("Failed to connect to RabbitMQ. Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  return connection;
}
