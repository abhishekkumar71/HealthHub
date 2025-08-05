const User = require("./src/models/UserModel");
const { verifyUser } = require("../middlewares/Authentication");
const bcrypt = require("bcryptjs");
const { createToken } = require("../middlewares/secretToken");

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
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
    res.cookie("token",token, {
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
};

module.exports.login = async (req, res) => {
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
};
module.exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
