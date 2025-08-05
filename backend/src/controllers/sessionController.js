const Session = require("./src/models/sessionModel");


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
  const { title, tags, mediaType, mediaUrls, steps, status, updatedAt } =
    req.body;

  if (!title || !tags || !mediaType || !mediaUrls || mediaUrls.length === 0) {
    return res.status(400).json({ message: "Required fields are missing!" });
  }

  try {
    const newSession = new Session({
      title,
      tags,
      mediaType,
      mediaUrls,
      steps,
      status: status || "draft",
      userId: req.user.id,
      updatedAt: updatedAt || new Date(),
    });

    await newSession.save();

    res.status(201).json({
      message: "Session uploaded successfully",
      session: newSession,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};
module.exports.deleteSession=async (req, res) => {
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
}
module.exports.editSession=async (req, res) => {
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
}
module.exports.mySessions=async (req, res) => {
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
}
module.exports.getSession=async (req, res) => {
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
}
module.exports.drafts=async (req, res) => {
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
}
module.exports.updateSession=async (req, res) => {
  try {
    let { id } = req.params;
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
}