const TweetHistory = require("../models/tweetHistory");

const logTweet = async (response, type, reference, success) => {
  try {
    await TweetHistory.create({
      response,
      refType: type,
      refId: reference,
      success,
    });
  } catch (err) {
    console.error(err);
    return;
  }
};

module.exports = { logTweet };
