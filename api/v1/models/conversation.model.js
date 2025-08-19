const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" } // customer + admin
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },
  updatedAt: { type: Date, default: Date.now }
});


const Conversation = mongoose.model('Conversation', ConversationSchema, "conversations");

module.exports = Conversation;