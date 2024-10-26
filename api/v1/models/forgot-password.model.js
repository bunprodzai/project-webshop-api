const mongoose = require("mongoose");

const forgetPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  { timestamps: true}
);

const ForgotPassword = mongoose.model("ForgotPassword", forgetPasswordSchema, "forgot-password");

module.exports = ForgotPassword;