const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;
module.exports.connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connect susccess");
  } catch (error) {
    console.log("Connect failed");
  }
}

