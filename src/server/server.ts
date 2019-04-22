import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import DataI from "../lib/interfaces/data";
import Namespace from "../lib/models/Namespace";
import namespaces from "../lib/data/namespaces";
const app = express();

app.use(express.static(__dirname));

const expressServer: http.Server = app.listen(9000);
const io: socketio.Server = socketio(expressServer, { serveClient: false });

console.log(namespaces);

io.of("/").on(
  "connection",
  (socket: socketio.Socket): void => {
    socket.emit("server", { data: "Welcome to root namespace" });
    socket.on(
      "server",
      (dataFromClient: DataI): void => {
        console.log(dataFromClient.data);
      }
    );
    socket.join(
      "level1",
      (): void => {
        io.of("/")
          .to("level1")
          .emit("joined", {
            data: `${socket.id} has joined level1 room`
          });
      }
    );

    socket.on(
      "chat",
      (message: DataI): void => {
        console.log(`client says: ${message.data}`);
        console.log(io.sockets.sockets);
        // check this it says io, not socket
        io.of("/").emit("chat", message);
      }
    );
  }
);

io.of("/admin").on(
  "connection",
  (socket: socketio.Socket): void => {
    io.of("/admin").emit("server", { data: "Welcome to admin namespace" });
    socket.on(
      "server",
      (dataFromClient: DataI): void => {
        console.log(dataFromClient.data);
      }
    );
  }
);
