const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  membership: {type: String, enum: ['non-member', 'member', 'admin']},
});


// Export model
module.exports = mongoose.model("User", UserSchema);