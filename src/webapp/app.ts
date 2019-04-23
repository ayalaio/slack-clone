import * as io from "socket.io-client";

import "webpack-icons-installer";
import "./main.scss";
import Namespace from "../lib/models/Namespace";
import NamespaceI from "../lib/interfaces/NamespaceI";
import Room from "../lib/models/Room";
import RoomI from "../lib/interfaces/RoomI";
import SocketPool from "./components/SocketPool";

const socketPool: SocketPool = new SocketPool("http://localhost:9000");

const rootSocket: SocketIOClient.Socket = socketPool.connectNamespace("/");

function cleanChat(): void {
  const messagesEl = document.querySelector("#messages");
  if (messagesEl != null) {
    messagesEl.innerHTML = "";
  }
}

function addMessage(message: string): void {
  const messagesEl = document.querySelector("#messages");
  if (messagesEl != null) {
    messagesEl.innerHTML += `<li>
                  <div class="user-image">
                    <img src="https://via.placeholder.com/50" />
                  </div>
                  <div class="user-message">
                    <div class="user-name-time">rbunch <span>1:25 pm</span></div>
                    <div class="message-text">${message}</div>
                  </div>
                </li>`;
  }
}

function drawRooms(rooms: RoomI[]): void {
  let elems = "";
  rooms.forEach(
    (room: RoomI): void => {
      elems += `<li ns="${room.namespace}" roomId="${room.id}" class="room">
      <span class="glyphicon ${
        room.isPrivate ? "glyphicon-lock" : "glyphicon-globe"
      }"></span>
      ${room.title}
    </li>`;
    }
  );
  const roomListEl = document.querySelector(".room-list");
  if (roomListEl != null) {
    roomListEl.innerHTML = elems;
  }
}

function setClickEventOnRooms(): void {
  const namespaceItemEls = document.querySelectorAll(".room");
  Array.from(namespaceItemEls).forEach(
    (el: Element): void => {
      el.addEventListener(
        "click",
        (e: Event): void => {
          const nsEndPoint = el.getAttribute("ns") || "";
          let currentSocket = socketPool.connectNamespace(nsEndPoint);

          if (!currentSocket.hasListeners("setChat")) {
            currentSocket.on(
              "setChat",
              (roomHistory: string[]): void => {
                cleanChat();
                roomHistory.forEach(
                  (message: string): void => {
                    addMessage(message);
                  }
                );
              }
            );
          }

          if (!currentSocket.hasListeners("joined")) {
            currentSocket.on(
              "joined",

              (message: string): void => {
                console.log(message);
              }
            );
          }

          if (!currentSocket.hasListeners("message")) {
            currentSocket.on(
              "message",
              (message: string): void => {
                addMessage(message);
              }
            );
          }

          currentSocket.emit("join", el.getAttribute("roomId"));

          const formEl = document.querySelector("#message-form") as HTMLElement;
          var formEl2 = formEl.cloneNode(true);
          if (formEl != null && formEl.parentNode) {
            formEl.parentNode.replaceChild(formEl2, formEl);
            formEl2.addEventListener("submit", function(e: Event): void {
              e.preventDefault();
              const textEl = document.querySelector(
                "#user-message"
              ) as HTMLInputElement;
              const text = textEl.value;
              let cs = currentSocket;
              if (cs != null) {
                cs.emit("message", {
                  text: text,
                  roomId: el.getAttribute("roomId")
                });
              }
            });
          }
        }
      );
    }
  );
}
function clickFirstRoom(): void {
  const itemEl = document.querySelector(".room") as HTMLElement;
  if (itemEl != null) {
    itemEl.click();
  }
}

function drawNamespaces(namespaces: NamespaceI[]): void {
  let namespacesEl = document.querySelector(".namespaces");
  if (namespacesEl != null) {
    let elems = "";

    namespaces.forEach(
      (ns: NamespaceI): void => {
        elems += `
        <div class="namespace" ns="${ns.endPoint}">
          <img src="${ns.img}">
        </div>
        `;
      }
    );
    namespacesEl.innerHTML = elems;
  }
}

function setClickEventOnNamespaces(): void {
  const namespaceItemEls = document.querySelectorAll(".namespace");
  Array.from(namespaceItemEls).forEach(
    (el: Element): void => {
      el.addEventListener(
        "click",
        (e: Event): void => {
          const nsEndPoint = el.getAttribute("ns") || "";
          let currentSocket = socketPool.connectNamespace(nsEndPoint);

          if (!currentSocket.hasListeners("setRooms")) {
            currentSocket.on(
              "setRooms",
              (rooms: RoomI[]): void => {
                drawRooms(rooms);
                setClickEventOnRooms();
                clickFirstRoom();
              }
            );
          }
          currentSocket.emit("setRooms");
        }
      );
    }
  );
}

function clickFirstNamespace(): void {
  const itemEl = document.querySelector(".namespace") as HTMLElement;
  if (itemEl != null) {
    itemEl.click();
  }
}

/* Main */

rootSocket.on(
  "setNamespaces",
  (namespaces: Namespace[]): void => {
    drawNamespaces(namespaces);
    setClickEventOnNamespaces();
    clickFirstNamespace();
  }
);
