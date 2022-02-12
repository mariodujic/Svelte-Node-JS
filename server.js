const express = require('express');
const app = express();
const http = require('http');
const {port} = require("./system.config");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {origin: "*"}
});

app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

let messages = []
let users = []

let addUser = (username, socketId) => {
  users.push({username, socketId})
}

let removeUser = (socketId) => {
  let index = users.findIndex(value => value.socketId === socketId)
  if (index >= 0) {
    users.splice(index, 1)
  }
}

let emitMessages = () => {
  io.emit("messages", messages)
}

let emitUsers = () => {
  io.emit("users", users.map(value => value.username))
}

io.on('connection', (socket) => {

  let socketId = socket.id

  emitMessages()
  emitUsers()

  socket.on("message", (message, user) => {
    messages.push({message, user})
    emitMessages()
  })

  socket.on("user", (user) => {
    addUser(user, socketId)
    emitUsers()
  })

  socket.on('disconnect', () => {
    removeUser(socketId)
    emitUsers()
  });
});

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
