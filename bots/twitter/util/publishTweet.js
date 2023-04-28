const client = require("../config/client");
const getImages = require("./getImagesFromURLs");
const path = require("path");

const publishTweet = async (text, image_urls) => {
  console.log("Preparing tweet...");

  const images = getImages(image_urls);
  const uploaded = [];

  if (images.length) {
    console.log("Uploading media...");
    for (const image of images) {
      try {
        const mediaId = await client.v1.uploadMedia(image);
        uploaded.push(mediaId);
      } catch (err) {
        console.error(err);
      }
    }
  }

  try {
    console.log("Posting tweet...");
    let tweet;

    if (images.length) {
      tweet = await client.v2.tweet({
        text: text,
        media: { media_ids: uploaded },
      });
    } else {
      tweet = await client.v2.tweet({
        text: text,
      });
    }

    console.log("Success!");
    return tweet;
  } catch (err) {
    console.error(err);
    return;
  }
};

module.exports = { publishTweet };
