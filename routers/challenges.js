const express = require("express");
const { db, executeQuery } = require("../db.js");
const { authenticateToken } = require("../auth");
const upload = require("../multer");

const router = express.Router();

// Create a new Challage
router.post("/", upload.single("imagefile"), (req, res, next) => {
  console.log(req.file);
  const imagefile = "/public/images/" + req.file.filename;

  const { image, title, discription, pricepool, participants, time } = req.body;
  executeQuery(
    "INSERT INTO Challages (image, title, discription, pricepool, participants, time) VALUES (?, ?, ?, ?, ?, ?)",
    [imagefile, title, discription, pricepool, participants, time],
    (error, results) => {
      if (error) {
        return next(error);
      }
      res.status(201).send(`Challage with id ${results.insertId} created`);
    }
  );
});

// Get all Challages
router.get("/", (req, res, next) => {
  executeQuery("SELECT * FROM Challages", [], (error, results) => {
    if (error) {
      return next(error);
    }
    const jsonString = JSON.stringify(results);
    res.send(jsonString);
  });
});

// Get a specific Challage by ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  executeQuery(
    "SELECT * FROM Challages WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.length === 0) {
        res.status(404).send("Challage not found");
      } else {
        res.send(results[0]);
      }
    }
  );
});

// Update a specific Challage by ID
router.put("/:id", upload.single("imagefile"), (req, res, next) => {
  const imagefile = "/public/images/" + req.file.filename;
  const { image, title, discription, pricepool, participants, time } = req.body;
  const { id } = req.params;

  executeQuery(
    "UPDATE Challages SET image = ?, title = ?, discription = ?, pricepool = ?, participants = ?, time = ? WHERE id = ?",
    [imagefile, title, discription, pricepool, participants, time, id],
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.affectedRows === 0) {
        res.status(404).send("Challage not found");
      } else {
        res.send("Challage updated successfully");
      }
    }
  );
});

// Delete a specific Challage by ID
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  executeQuery("DELETE FROM Challages WHERE id = ?", [id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.affectedRows === 0) {
      res.status(404).send("Challage not found");
    } else {
      res.send("Challage deleted successfully");
    }
  });
});

module.exports = router;
