const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const { globalErrorHandler, notFound } = require("./middleware/errorHandler");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Chat Application!");
});

app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/auth", userRoutes);

//  For Invalid Routes
app.use(notFound);
//  For Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
