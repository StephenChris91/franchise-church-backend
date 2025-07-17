const { Server } = require("socket.io");
const cors = require("cors");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket);
  });
}

module.exports = setupSocket;
