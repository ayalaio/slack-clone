import Hello from "./components/hello/hello";
import * as io from "socket.io-client";

Hello.render();
console.log("hello world");

const socket = io("http://localhost:8000");

console.log(socket);

socket.on(
  "connect",
  (): void => {
    socket.on(
      "welcome",
      (message: string): void => {
        console.log("rcv: " + message);
      }
    );
    socket.emit("message", { data: "thanks" });
  }
);
