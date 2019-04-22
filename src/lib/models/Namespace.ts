import Room from "./Room";

export default class Namespace {
  public readonly id: number;
  public readonly nsTitle: string;
  public readonly img: string;
  public readonly endPoint: string;
  private rooms: Room[];

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
    this.rooms = [];
  }

  public addRoom(room: Room): void {
    this.rooms.push(room);
  }
}
