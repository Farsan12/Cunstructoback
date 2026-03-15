const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text:{
    type:String
  },
  type: {
    type: String,
    enum: ["text", "payment"],
    default: "text"
  },
  paymentData: {
    paymentId:  { type: String },
    amount:     { type: Number },
    method:     { type: String },
    workerName: { type: String },
    note:       { type: String }
  }
},
{timestamps:true}
);

const messages = mongoose.model('messages', messageSchema);

module.exports = messages;
