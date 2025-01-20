const mongoose = require("mongoose");
const generateToken = require("../../../helpers/generateToken");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generateToken.generateToken()
  },
  phone: {
    type: String,
    default: ""
  },
  avatar: String,
  address: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const User = mongoose.model('User', userSchema, "users");

module.exports = User; 