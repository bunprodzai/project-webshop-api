const database = require("../../../config/database");

module.exports.connectMongo = async (req, res, next) => {
  await database.connect();
  next();
};