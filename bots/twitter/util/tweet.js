const optimizeTextForTwitter = require("./optimizeTextForTwitter");
const getImages = require("./getImagesFromURLs");
const publishTweet = require("./publishTweet");

const tweet = async (data) => {
  data.short_url =
    "https://canoreco.com.ph/category/patalastas-ng-power-interruption/";
  data.date_posted = new Date(data.date_posted);

  const {
    created,
    _id,
    url,
    short_url,
    date_posted,
    title,
    content,
    content_hash,
    images,
    affected_municipalities,
  } = data;

  const prepared_text = optimizeTextForTwitter({
    title,
    date_posted,
    short_url,
  });

  const base64images = await getImages(images);

  const result = await publishTweet(prepared_text, base64images);
};

module.exports = tweet;
