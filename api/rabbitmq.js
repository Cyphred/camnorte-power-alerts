const amqp = require("amqplib");

const startTweetConsumer = async (conn) => {
  const channel = await conn.createChannel();
  const queueName = "tweet_queue";
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, (message) => {
    const payload = JSON.parse(message.content.toString());
    // Insert action upon consumption here
    channel.ack(message);
  });

  conn.on("error", (err) => {
    console.error(err.message);
  });
};

const startConsumers = async (conn) => {
  startTweetConsumer(conn);
};

module.exports = { startConsumers };
