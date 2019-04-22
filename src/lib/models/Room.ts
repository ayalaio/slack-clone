export default class Room {
  public readonly id: number;
  public readonly title: string;
  public readonly namespace: string;
  public readonly isPrivate: boolean;
  private history: string[];
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
    this.history = [];
  }

  public addMessage(message: string): void {
    this.history.push(message);
  }

  public clearHistory(): void {
    this.history = [];
  }
}
