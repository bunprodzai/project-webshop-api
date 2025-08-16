const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema({
  user_id: String,
  id_rom: String,
  content: String,
  deleted: {
    default: false,
    type: Boolean
  },
  deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema, "chat");

module.exports = Chat; 