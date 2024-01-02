const express = require("express");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { globalErrorHandler, notFound } = require("./middleware/errorHandler");
const app = express();

app.use(express.json());

app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to Chat Application!");
});

app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/message", messageRoutes);

//  For Invalid Routes
app.use(notFound);
//  For Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
