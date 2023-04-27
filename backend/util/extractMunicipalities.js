const municipalities = require("../lib/municipalities");

const contains = (text, key) => {
  return text.includes(key);
};

const extractMunicipalities = (original_text) => {
  const detectedMunicipalities = [];
  let text = original_text;

  // Replaces newlines with spaces
  text = text.replace(/[\n]/g, " ");

  // Removes tabs
  text = text.replace(/[\t]/g, "");

  // TODO Find a better way to do this check, if possible

  if (contains(text, "BASUD")) {
    detectedMunicipalities.push(municipalities.BASUD);
  }

  if (contains(text, "CAPALONGA")) {
    detectedMunicipalities.push(municipalities.CAPALONGA);
  }

  if (contains(text, "DAET")) {
    detectedMunicipalities.push(municipalities.DAET);
  }

  if (contains(text, "LABO")) {
    detectedMunicipalities.push(municipalities.LABO);
  }

  if (contains(text, "MERCEDES")) {
    detectedMunicipalities.push(municipalities.MERCEDES);
  }

  if (contains(text, "PARACALE")) {
    detectedMunicipalities.push(municipalities.PARACALE);
  }

  if (contains(text, "LORENZO")) {
    detectedMunicipalities.push(municipalities.SAN_LORENZO_RUIZ);
  }

  if (contains(text, "VICENTE")) {
    detectedMunicipalities.push(municipalities.SAN_VICENTE);
  }

  if (contains(text, "TALISAY")) {
    detectedMunicipalities.push(municipalities.TALISAY);
  }

  if (contains(text, "VINZONS")) {
    detectedMunicipalities.push(municipalities.VINZONS);
  }

  if (contains(text, "ELENA")) {
    detectedMunicipalities.push(municipalities.SANTA_ELENA);
  }

  if (contains(text, "PANGANIBAN")) {
    detectedMunicipalities.push(municipalities.JOSE_PANGANIBAN);
  }

  return detectedMunicipalities;
};

module.exports = extractMunicipalities;
