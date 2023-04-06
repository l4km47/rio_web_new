const express = require("express");
const { db, executeQuery } = require("../db.js");
const { authenticateToken } = require("../auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.post("/register", async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      country,
      game,
      birthdate,
    } = req.body;

    // Check if username or email already exists
    const checkQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    const checkValues = [username, email];

    executeQuery(checkQuery, checkValues, async (error, result) => {
      if (error) {
        return next(error);
      }
      console.log(req.body);
      if (result.length > 0) {
        // Either the username or email already exists
        let errorMessage = "";
        if (result[0].username === username) {
          errorMessage = "Username already exists";
        } else if (result[0].email === email) {
          errorMessage = "Email already exists";
        }
        res.status(200).json({ error: errorMessage });
      } else {
        // Username and email are unique, proceed with registration
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const query =
          "INSERT INTO users (username, email, password, isAdmin,firstName, lastName, birthdate, country, game) VALUES (?, ?, ?, ?,?,?,?,?,?)";
        const values = [
          username,
          email,
          hashedPassword,
          0,
          firstName,
          lastName,
          birthdate,
          country,
          game,
        ];

        executeQuery(query, values, (error, result) => {
          if (error) {
            return next(error);
          }
          res.json({
            message: "User registered successfully",
            id: result.insertId,
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Check if email exists in the database
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    const checkValues = [email];

    executeQuery(checkQuery, checkValues, async (error, result) => {
      try {
        if (error) {
          return next(error);
        }
        if (result.length === 0) {
          // Email not found in database
          res.status(401).json({ error: "Invalid email or password" });
        } else {
          // Email found in database, check if password is correct
          const isMatch = await bcrypt.compare(password, result[0].password);
          if (isMatch) {
            // Password is correct, generate a token and send it to the client
            const token = jwt.sign(
              { id: result[0].id },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.json({
              token: token,
              email: result[0].email,
              username: result[0].username,
              isAdmin: result[0].isAdmin,
            });
          } else {
            // Password is incorrect
            res.status(401).json({ error: "Invalid email or password" });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  console.log(req.user);
  const userId = req.user.id;
  const query =
    "SELECT id, username, email, created_at, updated_at, isAdmin FROM users WHERE id = ?";
  const values = [userId];

  executeQuery(query, values, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send();
    }

    if (result.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = result[0];
    res.json(user);
  });
});

module.exports = router;
