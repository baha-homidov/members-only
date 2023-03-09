const mongoose = requrie("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, requried: true },
  text: { type: String, requried: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Exrport model
module.exports = mongoose.model("Message", MessageSchema);
