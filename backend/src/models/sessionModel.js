const { text } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const stepSchema = new Schema(
  {
    title: String,
    description: String,
  },
  { _id: false }
);
const sessionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: [String],
  mediaType: {
    type: String,
    enum: ["images", "video"],
    required: true,
  },
  mediaUrls: {
    type: [String],
    required: true,
  },
  steps:[stepSchema],
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
  this.updatedAt = Date.now();
  next();
});
const session = new Model("session", sessionSchema);
module.exports = session;
