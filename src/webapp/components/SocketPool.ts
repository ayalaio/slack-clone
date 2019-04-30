import Hash from "../../lib/interfaces/Hash";
import * as io from "socket.io-client";

export default class SocketPool {
  private pool: Hash<SocketIOClient.Socket> = {};
  private server: string;
  private username: string;
  private _currentSocket: SocketIOClient.Socket | null;

  public constructor(server: string, username: string) {
    this.server = server;
    this._currentSocket = null;
    this.username = username;
  }

  public connectNamespace(nsEndPoint: string): SocketIOClient.Socket {
    if (!this.pool[nsEndPoint]) {
      this.pool[nsEndPoint] = io(this.server + nsEndPoint, {
        query: {
          username: this.username
        }
      });
    } else {
      if (this.pool[nsEndPoint].disconnected) {
        this.pool[nsEndPoint].connect();
      }
    }
    this._currentSocket = this.pool[nsEndPoint];
    return this._currentSocket;
  }

  public get currentSocket(): SocketIOClient.Socket | null {
    return this._currentSocket;
  }
}
