import * as express from "express";
import * as socketio from "socket.io";
import * as http from "http";
import namespaces from "../lib/data/namespaces";
import Namespace from "../lib/models/Namespace";
import Room from "../lib/models/Room";
import NamespaceI from "../lib/interfaces/NamespaceI";

const app = express();

app.use(express.static(__dirname));

const expressServer: http.Server = app.listen(9000);
const io: socketio.Server = socketio(expressServer, { serveClient: false });

io.of("/").on(
  "connection",
  (socket: socketio.Socket): void => {
    socket.emit(
      "setNamespaces",
      namespaces.map(
        (ns: Namespace): NamespaceI => {
          return ns.asInterface();
        }
      )
    );
  }
);

namespaces.forEach(
  (ns: Namespace): void => {
    // console.log(ns);
    io.of(ns.endPoint).on(
      "connection",
      (socket: socketio.Socket): void => {
        console.log(`connected... to ${ns.endPoint}`);
        socket.on(
          "setRooms",
          (): void => {
            console.log(`emmiting rooms to ${ns.endPoint}`);
            socket.emit("setRooms", ns.rooms);
          }
        );

        socket.on(
          "message",
          (message: { text: string; roomId: string }): void => {
            const room: Room = ns.rooms[parseInt(message.roomId)];
            room.addMessage(message.text);
            io.of(ns.endPoint)
              .to(message.roomId)
              .emit("message", message.text);
          }
        );

        socket.on(
          "join",
          (roomId: string): void => {
            const room: Room = ns.rooms[parseInt(roomId)];
            socket.emit("setChat", room.history);

            socket.leaveAll();

            socket.join(
              roomId,
              (): void => {
                io.of(ns.endPoint)
                  .to(roomId)
                  .emit(
                    "joined",
                    `${socket.id} has joined ${room.title} of ${ns.endPoint}`
                  );
              }
            );
          }
        );
      }
    );
  }
);
