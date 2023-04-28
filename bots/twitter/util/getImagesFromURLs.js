const { request } = require("http");

const getImagesFromURLs = async (urls) => {
  const images = [];

  for (const url of urls) {
    request(url, { encoding: "binary" }, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }

      const image = Buffer.from(body, "binary").toString("base64");

      if (image) {
        images.push(image);
      }
    });
  }

  return images;
};

module.exports = getImagesFromURLs;
