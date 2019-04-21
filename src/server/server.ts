import * as socketio from "socket.io";
import * as http from "http";

console.log("server++");

const server = http.createServer(
  (request: http.IncomingMessage, response: http.ServerResponse): void => {
    response.end("I am connected!!!");
  }
);

const io = socketio(server);

io.on(
  "connection",
  (socket: socketio.Socket): void => {
    socket.emit("welcome", "Welcome to socketio");
    socket.on(
      "message",
      (msg: { data: string }): void => {
        console.log("rcv: " + msg.data);
      }
    );
  }
);

server.listen(8000);
