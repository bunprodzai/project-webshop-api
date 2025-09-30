const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema({
  websiteName: String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  copyright: String,
  facebook: String,
  instagram: String,
  map_url: String,
  shopee: String,
  lazada: String,
  tiki: String
},
  {
    timestamps: true,
  });

const SettingGeneral = mongoose.model('Setting', settingGeneralSchema, "settings-general"); //roles là tên connection trong database

module.exports = SettingGeneral; 