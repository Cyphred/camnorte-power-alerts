const client = require("../config/client");
const { Buffer } = require("buffer");
const { EUploadMimeType } = require("twitter-api-v2");

const publishTweet = async (text, images) => {
  console.log("Preparing tweet...");

  const uploaded = [];

  if (images && images.length) {
    console.log("Uploading media...");
    for (const image of images) {
      try {
        const ImageBuffer = Buffer.from(image, "base64");
        const mediaId = await client.v1.uploadMedia(ImageBuffer, {
          mimeType: EUploadMimeType.Png,
        });
        uploaded.push(mediaId);
      } catch (err) {
        console.error(err);
      }
    }

    if (images.length !== uploaded.length) {
      console.error("Could not upload image. Aborting...");
      return;
    }
  }

  try {
    console.log("Posting tweet...");
    let tweet;

    if (uploaded.length) {
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

module.exports = publishTweet;
