const axios = require("axios");

const getImagesFromURLs = async (urls) => {
  console.log(`Fetching ${urls.length} images`);
  const images = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const image = Buffer.from(response.data, "binary").toString("base64");
      if (image) {
        images.push(image);
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log(`Fetched ${images.length} images`);
  return images;
};

module.exports = getImagesFromURLs;
