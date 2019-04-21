import * as io from "socket.io-client";
import DataI from "../lib/data";

const socket = io("http://localhost:9000");

socket.on(
  "connect",
  (): void => {
    socket.on(
      "messageFromServer",
      (dataFromServer: DataI): void => {
        console.log(dataFromServer.data);
        socket.emit("messageToServer", { data: "Data from client" });
      }
    );
    socket.emit("message", { data: "thanks" });
  }
);
