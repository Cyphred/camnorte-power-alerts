const { TwitterApi } = require("twitter-api-v2");
const client = require("./config/client");
const path = require("path");

const publishTweet = async (text, image_urls) => {
  console.log("Preparing tweet...");

  const images = [];

  if (image_urls && image_urls.length) {
    console.log("Uploading media...");
    for (const url of image_urls) {
      try {
        const mediaId = await client.v1.uploadMedia(url);
        images.push(mediaId);
      } catch (err) {
        console.error(err);
      }
    }
  }

  try {
    console.log("Posting tweet...");
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: images },
    });

    console.log("Success!");
    return tweet;
  } catch (err) {
    console.error(err);
    return;
  }
};
