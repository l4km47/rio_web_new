const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/gogota.duckdns.org/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/gogota.duckdns.org/fullchain.pem"
  ),
};

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
    origin: "https://riogamers.lk",
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
const server = https.createServer(options, app);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
