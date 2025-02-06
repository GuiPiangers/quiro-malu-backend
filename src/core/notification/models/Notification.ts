import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export type NotificationDOT = {
  id?: string;
  title: string;
  type: string;
  message: string;
  createdAt: DateTime;
  read: boolean;
};

export class Notification extends Entity {
  readonly title: string;
  readonly type: string;
  readonly message: string;
  readonly createdAt: DateTime;
  readonly read: boolean;

  constructor({ id, createdAt, message, read, title, type }: NotificationDOT) {
    super(id);
    this.title = title;
    this.createdAt = createdAt;
    this.message = message;
    this.type = type;
    this.read = read;
  }
}
