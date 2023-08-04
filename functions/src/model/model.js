const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
todoItemSchema.set("timestamps", true);

const userSchema = new mongoose.Schema({
  full_name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  todo: [todoItemSchema],
  completed: [todoItemSchema],
});
userSchema.set("timestamps", true);

const Users = mongoose.model("user", userSchema);

module.exports = Users;
