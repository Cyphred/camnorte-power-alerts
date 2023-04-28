const amqp = require("amqplib");
const { startConsumer } = require("./consumer");
const tweet = require("../util/tweet");

let connection;

const connectToRabbitMQ = async () => {
  while (true) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      console.log("Connected to RabbitMQ");
      return connection;
      break;
    } catch (error) {
      console.log("Failed to connect to RabbitMQ. Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

const setup = async () => {
  connection = await connectToRabbitMQ();

  await startConsumer(connection, "twitter_publish", (message) => {
    tweet(message);
  });
};

module.exports = setup;
