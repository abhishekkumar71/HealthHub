const Session = require("../models/sessionModel");

module.exports.allPosts = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "published" }).sort({
      updatedAt: -1,
    });
    res.json({ success: true, sessions });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports.newSession = async (req, res) => {
  try {
    const { title, tags, cover, steps, status } = req.body;
    const userId = req.user._id;
    const author = req.user.username;
    if (!title || !tags || !Array.isArray(steps) || !userId) {
      return res.status(400).json({ message: "Required fields are missing!" });
    }

    const newSession = new Session({
      title,
      tags,
      cover,
      steps,
      status: status || "draft",
      userId,
      updatedAt: Date.now(),
      author,
    });

    await newSession.save();
    res.status(201).json({ success: true, session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteSession = async (req, res) => {
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
};
module.exports.editSession = async (req, res) => {
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
      message: "something went wrong!!",
      success: false,
    });
  }
};
module.exports.mySessions = async (req, res) => {
  try {
    const allPosts = await Session.find({
      userId: req.user.id,
      status: "published",
    });
    if (!allPosts.length) {
      return res.status(200).json({ message: "No posts found!" });
    }
    return res.json({ sessions: allPosts, success: true });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Something went wrong!", success: false });
  }
};
module.exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports.drafts = async (req, res) => {
  try {
    const drafts = await Session.find({ userId: req.user.id, status: "draft" });
    console.log(drafts.length);
    if (!drafts.length) {
      return res.status(204).json({ message: "No drafts available!" });
    }
    return res.json({ success: true, drafts });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
module.exports.updateSession = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let session = await Session.findByIdAndUpdate(id, req.body);
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
};
