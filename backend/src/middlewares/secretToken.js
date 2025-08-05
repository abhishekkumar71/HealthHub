const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports.createToken = (id) => {
  return jwt.sign({ _id: id }, process.env.SECRET_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
