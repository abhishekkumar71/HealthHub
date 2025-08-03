const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
module.exports.verifyUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "authentication Failed!",
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    try {
      const user = await User.findById(data._id);
      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }
      req.userId = user._id;
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  });
};
