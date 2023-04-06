const express = require("express");
const router = express.Router();
const { db, executeQuery } = require("../db.js");
const { authenticateToken } = require("../auth");
const upload = require("../multer");

// GET all events
router.get("/", (req, res) => {
  executeQuery("SELECT * FROM Events", [], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// GET a single event by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  executeQuery("SELECT * FROM Events WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// CREATE a new event
router.post("/", upload.single("imagefile"), (req, res, next) => {
  const imagefile = "/public/images/" + req.file.filename;
  const {
    image,
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventLocation,
    eventGame,
    eventLink,
  } = req.body;
  executeQuery(
    "INSERT INTO Events (image, eventName, eventDescription, eventDate, eventTime, eventLocation, eventGame, eventLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      imagefile,
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      eventGame,
      eventLink,
    ],
    (error, result) => {
      if (error) {
        return next(error);
      } else {
        res.status(201).json({ id: result.insertId, message: "Event created" });
      }
    }
  );
});

// UPDATE an existing event by ID
router.put("/:id", upload.single("imagefile"), (req, res) => {
  const imagefile = "/public/images/" + req.file.filename;
  const { id } = req.params;
  const {
    image,
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventLocation,
    eventGame,
    eventLink,
  } = req.body;
  executeQuery(
    "UPDATE Events SET image = ?, eventName = ?, eventDescription = ?, eventDate = ?, eventTime = ?, eventLocation = ?, eventGame = ?, eventLink = ? WHERE id = ?",
    [
      imagefile,
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      eventGame,
      eventLink,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Event not found" });
      } else {
        res.json({ message: "Event updated" });
      }
    }
  );
});

// DELETE an event by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  executeQuery("DELETE FROM Events WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json({ message: "Event deleted" });
    }
  });
});

module.exports = router;
