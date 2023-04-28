const { startTweetConsumer } = require("./consumers/tweets");

const startConsumers = async (connection) => {
  await startTweetConsumer(connection);
};

module.exports = startConsumers;
