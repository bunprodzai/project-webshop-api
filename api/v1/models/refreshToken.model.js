const mongoose = require("mongoose");


const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String, required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date, default: Date.now
  }
},
  {
    timestamps: true,
  });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, "refresh-token"); //roles là tên connection trong database

module.exports = RefreshToken; 