const express = require("express");
const router = express.Router();
const { db, executeQuery } = require("../db.js");
const { authenticateToken } = require("../auth");
const upload = require("../multer");

// Create a new slide
router.post("/", upload.single("imagefile"), (req, res, next) => {
  const image = "/public/images/" + req.file.filename;
  const { title, description, url } = req.body;
  const showDescription = req.body.showDescription === "true";
  const query =
    "INSERT INTO slides (image, title, description, url, showDescription) VALUES (?, ?, ?, ?, ?)";
  const values = [image, title, description, url, showDescription];

  executeQuery(query, values, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json({ message: "Slide created successfully", id: result.insertId });
  });
});

// Get all slides
router.get("/", (req, res, next) => {
  const query = "SELECT * FROM slides";
  executeQuery(query, [], (error, results) => {
    if (error) {
      return next(error);
    }
    res.json(results);
  });
});

// Get a slide by id
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT * FROM slides WHERE id = ?";
  executeQuery(query, [id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json(results[0]);
  });
});

// Update a slide by id
router.put("/:id", upload.single("imagefile"), (req, res, next) => {
  console.log(req.body);
  const { id } = req.params;
  const { title, description, url } = req.body;
  let updateValues = "";
  let values = [];
  const showDescription = req.body.showDescription === "true" ? 1 : 0;
  console.log(showDescription);
  if (req.file) {
    const image = req.file.filename;
    updateValues = "image=?, title=?, description=?, url=?, showDescription=?";
    values = [image, title, description, url, showDescription, id];
  } else {
    updateValues = "title = ?, description = ?, url = ?, showDescription=?";
    values = [title, description, url, showDescription, id];
  }

  const query = `UPDATE slides SET ${updateValues} WHERE id = ?`;
  executeQuery(query, values, (error, result) => {
    if (error) {
      return next(error);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json({ message: "Slide updated successfully", id: id });
  });
});

// Delete a slide by id
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  const query = "DELETE FROM slides WHERE id = ?";
  executeQuery(query, [id], (error, result) => {
    if (error) {
      return next(error);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json({ message: "Slide deleted successfully", id: id });
  });
});
module.exports = router;
