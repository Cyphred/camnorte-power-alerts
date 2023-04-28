const amqp = require("amqplib");

/**
 * Starts a consumer and defines its behavior
 * @param {Object} conn is the connection object
 * @param {Function} callback will be run when a message has been consumed
 */
const startConsumer = async (conn, queue_name, callback) => {
  const channel = await conn.createChannel();
  await channel.assertQueue(queue_name, { durable: true });

  channel.consume(queue_name, (message) => {
    const payload = JSON.parse(message.content.toString());
    callback(payload);
    channel.ack(message);
  });

  conn.on("error", (err) => {
    console.error(err.message);
  });
};

module.exports = { startConsumer };
