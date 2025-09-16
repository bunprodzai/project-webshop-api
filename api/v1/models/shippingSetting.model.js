const mongoose = require("mongoose");

const shippingSettingchema = new mongoose.Schema(
  {
  defaultFee: {
    type: Number,
    default: 30000
  },
  freeThreshold: {
    type: Number,
    default: 500000
  }
});
const ShippingSetting = mongoose.model('ShippingSetting', shippingSettingchema, "shipping-settings");

module.exports = ShippingSetting;