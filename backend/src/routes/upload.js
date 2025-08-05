const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { messaging } = require("firebase-admin");
const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/upload", upload.array("files", 10), async (req, res) => {
  if (!req.files || req.files.length == 0) {
    return res.status(400).json({ message: "no files uploaded!" });
  }
  const urls = req.files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );
  res.json({ urls });
});

module.exports = router;
