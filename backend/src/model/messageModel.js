import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type:String,   // links to User model
    required: true
  },
  receiver: {
    type: String,
   // links to User model
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  timestamp : {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Message", messageSchema);
