export default interface RoomI {
  readonly id: number;
  readonly title: string;
  readonly namespace: string;
  readonly isPrivate: boolean;
}
