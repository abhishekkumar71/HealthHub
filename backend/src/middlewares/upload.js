const express = require("express");
const multer = require("multer");
const router = express.Router();
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

router.post("/upload", upload.array("files", 10), async (req, res) => {
  if (!req.files || req.files.length == 0) {
    return res.status(400).json({ message: "no files uploaded!" });
  }

  const urls = req.files.map((file) => file.path); 
  res.json({ urls });
});

module.exports = router;
