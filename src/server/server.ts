import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import DataI from "../lib/data";
const app = express();

console.log(__dirname);

app.use(express.static(__dirname));

const expressServer: http.Server = app.listen(9000);
const io: socketio.Server = socketio(expressServer, { serveClient: false });

io.on(
  "connection",
  (socket: socketio.Socket): void => {
    socket.emit("welcome", { data: "Welcome to socketio server" });
    socket.on(
      "welcome",
      (dataFromClient: DataI): void => {
        console.log(dataFromClient.data);
      }
    );

    socket.on(
      "chat",
      (message: DataI): void => {
        console.log(`client says: ${message.data}`);
        console.log(io.sockets.sockets);
        // check this says io, not socket
        io.emit("chat", message);
      }
    );
  }
);
