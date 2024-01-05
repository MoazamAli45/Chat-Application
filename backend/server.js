const app = require("./app");
const colors = require("colors");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT} `.yellow.bold);
});

/**
 * The socket.io instance for handling real-time communication.
 * @type {SocketIO.Server}
 */
const io = require("socket.io")(server, {
  pingtimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

//  On Connecting the Socket
io.on("connection", (socket) => {
  console.log(`New Connection ${socket.id}`);

  socket.on("setup", (userData) => {
    console.log("Connected", userData);
    socket.join(userData?._id);
    console.log("SETUP", userData?._id);
    socket.emit("connected");
  });

  //  ON Sending the Message
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined", room);
  });

  //  ON New message Received
  // It sends a received message (newMessageReceived)
  // to all users in a chat room except the sender, using Socket.IO

  //   FOR TYPING
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      //  TO SEND IN ABOVE ROOMS

      try {
        socket.in(user._id).emit("message received", newMessageReceived);
      } catch (error) {
        console.error("Error emitting message-received:", error);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

// The emit function is used to send an event from one side
//  (either the server or a client) to the other. It has at least one parameter:

// on is used for receiving events from the other side. It has at least two parameters:
