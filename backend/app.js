const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Chat Application!");
});

app.use("/api/v1/chat", chatRoutes);
module.exports = app;
