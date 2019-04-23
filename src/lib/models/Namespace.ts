import Room from "./Room";
import NamespaceI from "../interfaces/NamespaceI";

export default class Namespace implements NamespaceI {
  public readonly id: number;
  public readonly nsTitle: string;
  public readonly img: string;
  public readonly endPoint: string;
  private _rooms: Room[];

  public constructor(
    id: number,
    nsTitle: string,
    img: string,
    endPoint: string
  ) {
    this.id = id;
    this.img = img;
    this.nsTitle = nsTitle;
    this.endPoint = endPoint;
    this._rooms = [];
  }

  public addRoom(room: Room): void {
    this._rooms.push(room);
  }

  public get rooms(): Room[] {
    return [...this._rooms];
  }

  public asInterface(): NamespaceI {
    return {
      id: this.id,
      img: this.img,
      nsTitle: this.nsTitle,
      endPoint: this.endPoint
    };
  }
}
