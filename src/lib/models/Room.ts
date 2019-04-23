import RoomI from "../interfaces/RoomI";

export default class Room implements RoomI {
  public readonly id: number;
  public readonly title: string;
  public readonly namespace: string;
  public readonly isPrivate: boolean;
  private _history: string[];
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

  public addMessage(message: string): void {
    this._history.push(message);
  }

  public clearHistory(): void {
    this._history = [];
  }

  public get history(): string[] {
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
