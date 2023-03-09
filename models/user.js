const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  membership: {type: String, enum: ['non-member', 'member', 'admin']},
});


// Export model
module.exports = mongoose.model("User", UserSchema);