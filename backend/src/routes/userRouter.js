const router = require("express").Router();
const {
  register,
  login,
  me,
  logout,
} = require("../controllers/userController");
const verifyUser = require("../middlewares/Authentication");

router.get("/logout", logout);
router.get("/me", verifyUser, me);
router.post("/register", register);
router.post("/login", login);
