import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import DataI from "../lib/data";
const app = express();

console.log(__dirname);

app.use(express.static(__dirname));

const expressServer: http.Server = app.listen(9000);
const io = socketio(expressServer, { serveClient: false });

io.on(
  "connection",
  (socket: socketio.Socket): void => {
    socket.emit("messageFromServer", { data: "Welcome to socketio server" });
    socket.on(
      "messageToServer",
      (dataFromClient: DataI): void => {
        console.log(dataFromClient.data);
      }
    );
  }
);
