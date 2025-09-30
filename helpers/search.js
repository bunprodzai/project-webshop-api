const unidecode = require("unidecode");

// Chuyển keyword thành slug
const convertToSlug = (text) => {
  const unidecodeText = unidecode(text.trim());
  const slug = unidecodeText.replace(/\s+/g, "-");
  return slug;
};

// Xử lý tìm kiếm
const searchHelper = (query) => {
  let objSearch = {
    keyword: "",
    condition: {}
  };

  if (query.keyword) {
    objSearch.keyword = query.keyword;

    const keywordRegex = new RegExp(query.keyword, "i");
    const stringSlug = convertToSlug(query.keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");

    objSearch.condition = {
      $or: [
        { slug: stringSlugRegex },
        { title: keywordRegex }
      ]
    };
  }

  return objSearch;
};

module.exports = searchHelper;
