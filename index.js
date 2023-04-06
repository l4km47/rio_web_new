const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");

const challengesRouter = require("./routers/challenges");
const eventsRouter = require("./routers/events");
const uploadRouter = require("./routers/upload");
const slidesRouter = require("./routers/slides");
const userRouter = require("./routers/user");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://riogamers.lk/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Use the challenges and events routers
app.use("/challenges", challengesRouter);
app.use("/events", eventsRouter);
app.use("/upload", uploadRouter);
app.use("/slide", slidesRouter);
app.use("/", userRouter);

app.get("/test", (req, res) => {
  res.send("api is working");
});

console.log(listEndpoints(app));

app.listen(3000, () => {
  console.log("Server started port is 3000");
});
