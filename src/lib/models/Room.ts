import RoomI from "../interfaces/RoomI";
import MessageI from "../interfaces/MessageI";

export default class Room implements RoomI {
  public readonly id: number;
  public readonly title: string;
  public readonly namespace: string;
  public readonly isPrivate: boolean;
  private _history: MessageI[];
  public constructor(
    id: number,
    title: string,
    namespace: string,
    isPrivate = false
  ) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.isPrivate = isPrivate;
    this._history = [];
  }

  public addMessage(message: MessageI): void {
    this._history.push(message);
  }

  public clearHistory(): void {
    this._history = [];
  }

  public get history(): MessageI[] {
    return [...this._history];
  }

  public asInterface(): RoomI {
    return {
      id: this.id,
      title: this.title,
      namespace: this.namespace,
      isPrivate: this.isPrivate
    };
  }
}
