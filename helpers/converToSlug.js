const unidecode = require("unidecode");

// Chuyển keyword thành slug
const convertToSlug = (text) => {
  const unidecodeText = unidecode(text.trim());
  const slug = unidecodeText.replace(/\s+/g, "-");
  return slug;
};

module.exports = convertToSlug;