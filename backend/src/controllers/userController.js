const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { createToken } = require("../middlewares/secretToken");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
};

module.exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ message: "All fields are required!" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists!" });
    }

    let newUser = new User({ username, email, password });
    await newUser.save();

    const token = createToken(newUser._id);
    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "User registration successful!",
      success: true
    });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "Something went wrong!",
      success: false
    });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User doesn't exist!" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({ message: "Invalid password!" });
    }

    const token = createToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Logged in successfully!",
      success: true
    });
  } catch (e) {
    console.log(e);
    return res.json({
      message: "Something went wrong!",
      success: false
    });
  }
};
