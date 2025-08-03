const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const sessionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: [String],
  jsonUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
sessionSchema.pre("save", function (next) {
  updatedAt: Date.now();
  next();
});
const session = new Model("session", sessionSchema);
module.exports = session;
