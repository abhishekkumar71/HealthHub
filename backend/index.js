const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./src/models/UserModel");
const Session = require("./src/models/sessionModel");
const cors = require("cors");
const sessions = require("./sessions.json");
require("dotenv").config();
const db_url = process.env.MONGO_URL;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { createToken } = require("./src/utils/secretToken");
const { verifyUser } = require("./src/utils/Authentication");
const user = require("./src/models/UserModel");
app.use(
  cors({
    origin: ["https://healthhub-ud5p.onrender.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// app.post("/seed-sessions", async (req, res) => {
//   try {
//     await Session.insertMany(sessions);
//     res.json({ success: true, message: "Seeded sessions successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Seeding failed", error: err });
//   }
// });
// LOGOUT
app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ success: true });
});

app.post("/newsession", verifyUser, async (req, res) => {
  const { title, tags, jsonUrl, status, updatedAt } = req.body;

  if (!title || !tags || !jsonUrl) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const newSession = new Session({
      title,
      tags,
      jsonUrl,
      status,
      userId: req.user.id,
      updatedAt: updatedAt || new Date(),
    });

    await newSession.save();

    res.status(201).json({
      message: "Post uploaded successfully",
      session: newSession,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

// DELETE A SESSION
app.delete("/delete/:id", verifyUser, async (req, res) => {
  try {
    let { id } = req.params;
    let session = await Session.findByIdAndDelete(id);
    if (!session) {
      return res.json({ message: "no sessions found!" });
    }
    return res.json({ message: "session deleted succesfully!", success: true });
  } catch (e) {
    console.log(e);
    return res.json({ message: "something went wrong!", success: false });
  }
});
// EDIT SESSION
app.get("/edit/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let session = await Session.findById(id);
    if (!session) {
      return res.json({ message: "No sessions found" });
    }
    return res.json({
      message: "session found",
      success: true,
      session,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      messaage: "something went wrong!!",
      success: false,
    });
  }
});
// UPDATE SESSION
app.put("/edit/:id", verifyUser, async (req, res) => {
  try {
    let { id } = req.params;
    let session = Session.findByIdAndUpdate(id, req.body);
    if (!session) {
      return res.json({
        message: "No sessions found!",
      });
    }
    return res.json({
      message: "session updated!",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "Something went wrong!",
      success: false,
    });
  }
});
// GET ALL SESSIONS
app.get("/my-sessions", verifyUser, async (req, res) => {
  try {
    const allPosts = await Session.find({ userId: req.user.id, status: "published" });
    console.log(allPosts);
    if (!allPosts.length) {
      return res.status(200).json({ message: "No posts found!" });
    }
    return res.json({ sessions: allPosts, success: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong!", success: false });
  }
});

// DISPLAY A SINGLE SESSION
app.get("/session/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// GET DRAFTS
app.get("/drafts", verifyUser, async (req, res) => {
  try {
const drafts = await Session.find({ userId: req.user.id, status: "draft" });
    if (!drafts.length) {
      return res.status(204).json({ message: "No drafts available!" });
    }
    return res.json({ success: true, drafts });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

//GET USER
app.get("/me", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// GET ALL PUBLISHED SESSIONS
app.get("/all-posts", async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" }).sort({
      updatedAt: -1,
    });
    res.json({ success: true, sessions });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name);
  if (!name || !email || !password) {
    return res.json({ message: "All fields are requred!" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "user already exists!" });
    }
    let newuser = new User({ name, email, password });
    await newuser.save();
    console.log(newuser);
    const token = createToken(newuser._id);
    res.cookie("token",  {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({
      message: "user registration successful!",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "something went wrong!",
      success: false,
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "all fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User doesn't exist!" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({
        message: "Invalid Password!",
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({
      message: "Logged In successfully!",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "something went wrong!",
      success: false,
    });
  }
});

app.listen(8080, () => {
  mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, 
  tlsAllowInvalidCertificates: true, 
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

  console.log("listening to port: 8080");
});
