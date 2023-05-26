const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const config = require("./config/config");
let server = app;

// establishing connection with mongoose database
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("Connected to mongoose DB");
  })
  .catch((err) => {
    console.log("Unable to connect to mongoose DB");
  });

// starting the nodejs app server on desired port
const ioServer = server.listen(config.port || 3000, () => {
  console.log(`Server Listening at PORT ${config.port || 3000}`);
});

// creating socket.io server configurations for real time messaging
const io = require("socket.io")(ioServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

// creating socket.io server connection for the provided user from front end
io.on("connection", (socket) => {
  console.log(`Connected to socket.io`);
  socket.on("setup", (email) => {
    socket.join(email);
    socket.emit("connected");
  });

  // creating an chat room for recieved users
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  // sending messages in real time to users except the logined user
  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user.email == newMessageRecieved.sender.email) return;
      socket.in(user.email).emit("message recieved", newMessageRecieved);
    });
  });
  // disconnecting connection to reduce load on server
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(email);
  });
});

exports.api = firebase.https.onRequest(server);
