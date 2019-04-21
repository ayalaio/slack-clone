import * as io from "socket.io-client";
import DataI from "../lib/data";

import "./main.scss";

const socket = io("http://localhost:9000");

socket.on(
  "connect",
  (): void => {
    socket.on(
      "welcome",
      (dataFromServer: DataI): void => {
        console.log(dataFromServer.data);
        socket.emit("welcome", { data: `ack: ${dataFromServer.data}` });
      }
    );

    socket.on(
      "chat",
      (message: DataI): void => {
        const messagesEl = document.querySelector("#messages");
        if (messagesEl != null) {
          messagesEl.innerHTML += `<li>${message.data}</li>`;
        }
      }
    );
  }
);

const messageFormEl = document.querySelector("#message-form");
if (messageFormEl != null) {
  messageFormEl.addEventListener(
    "submit",
    (event: Event): void => {
      event.preventDefault();
      const userMessageEl: HTMLInputElement | null = document.querySelector(
        "#user-message"
      ) as HTMLInputElement;
      if (userMessageEl != null) {
        const message = userMessageEl.value;
        socket.emit("chat", { data: message });
      }
    }
  );
}
