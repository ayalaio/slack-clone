import * as io from "socket.io-client";
import DataI from "../lib/data";

import "./main.scss";

const rootNS: SocketIOClient.Socket = io("http://localhost:9000");
const adminNS: SocketIOClient.Socket = io("http://localhost:9000/admin");

rootNS.on(
  "server",
  (dataFromServer: DataI): void => {
    console.log(dataFromServer.data);
    rootNS.emit("server", { data: `ack: ${dataFromServer.data}` });
  }
);

rootNS.on(
  "joined",
  (msg: DataI): void => {
    console.log(msg.data);
  }
);

adminNS.on(
  "server",
  (dataFromServer: DataI): void => {
    console.log(dataFromServer.data);
    adminNS.emit("server", { data: `ack: ${dataFromServer.data}` });
  }
);

rootNS.on(
  "chat",
  (message: DataI): void => {
    const messagesEl = document.querySelector("#messages");
    if (messagesEl != null) {
      messagesEl.innerHTML += `<li>${message.data}</li>`;
    }
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
        rootNS.emit("chat", { data: message });
      }
    }
  );
}
