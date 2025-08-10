const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const stepSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: { type: String }, // can be image or video URL
    link: { type: String }, // optional
  },
  { _id: false }
);

const sessionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String, // URL of cover image
  },
  tags: {
    type: [String],
    default: [],
  },
  steps: {
    type: [stepSchema],
    default: [],
    validate: {
      validator: function (steps) {
        return Array.isArray(steps) && steps.length > 0;
      },
      message: "At least one step is required.",
    },
  },
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
  author: { type: String, required: true },
});

sessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Session = Model("Session", sessionSchema);
module.exports = Session;
