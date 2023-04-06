const express = require("express");
const router = express.Router();
const { db, executeQuery } = require("../db.js");
const { authenticateToken } = require("../auth");
const upload = require("../multer");
router.post("/", upload.single("image"), (req, res, next) => {
  const { title, description, pricepool, participants, time } = req.body;
  const imageFilePath = req.file; // remove "public/" from the filepath
  res.send(imageFilePath);
});
module.exports = router;
