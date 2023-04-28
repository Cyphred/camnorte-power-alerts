const amqp = require("amqplib/callback_api");

const publish = async (queue_name, payload) => {
  amqp.connect(process.env.RABBITMQ_URI, (error0, connection) => {
    if (error0) {
      console.error(error0);
      return false;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        console.error(error1);
        connection.close();
        return false;
      }

      channel.assertQueue(queue_name, { durable: true }, function (err, ok) {
        if (err !== null) {
          console.error("Error asserting queue_name:", err);
          connection.close();
          return false;
        }

        channel.sendToQueue(
          queue_name,
          Buffer.from(JSON.stringify(payload)),
          function (err, ok) {
            if (err !== null) {
              console.error("Error sending message:", err);
              connection.close();
              return false;
            } else {
              connection.close();
              return true;
            }
          }
        );
      });
    });
  });
};

module.exports = publish;
