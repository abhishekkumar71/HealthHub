const router = require("express").Router();
const {verifyUser} = require("../middlewares/Authentication");

const {
  allPosts,
  newSession,
  deleteSession,
  editSession,
  mySessions,
  getSession,
  drafts,
  updateSession,
} = require("../controllers/sessionController");
router.get("/all-posts", allPosts);
router.post("/newsession", verifyUser, newSession);
router.delete("/delete/:id", verifyUser, deleteSession);
router.get("/edit/:id", verifyUser, editSession);
router.get("/my-sessions", verifyUser, mySessions);
router.get("/session/:id",  getSession);
router.get("/drafts", verifyUser, drafts);
router.put("/edit/:id", verifyUser, updateSession);
module.exports=router;