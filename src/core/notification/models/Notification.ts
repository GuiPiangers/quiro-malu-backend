import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export type NotificationDTO = {
  id?: string;
  title: string;
  type: string;
  message: string;
  createdAt?: DateTime;
  read?: boolean;
  needAction?: boolean;
};

export class Notification extends Entity {
  readonly title: string;
  readonly type: string;
  readonly message: string;
  readonly createdAt?: DateTime;
  readonly read: boolean;
  readonly needAction?: boolean;

  constructor({
    id,
    createdAt,
    message,
    read,
    title,
    type,
    needAction,
  }: NotificationDTO) {
    super(id);
    this.title = title;
    this.createdAt = createdAt;
    this.message = message;
    this.type = type;
    this.read = read !== undefined ? read : false;
    this.needAction = needAction;
  }

  getDTO() {
    return {
      createdAt: this.createdAt,
      message: this.message,
      read: this.read,
      title: this.title,
      type: this.type,
      id: this.id,
      needAction: this.needAction,
    };
  }
}
