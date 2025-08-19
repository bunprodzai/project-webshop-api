const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ai gửi
  text: String,
  attachments: [String], // link ảnh/file nếu có
  createdAt: { type: Date, default: Date.now }
});


const Message = mongoose.model('Message', MessageSchema, "messages");

module.exports = Message;