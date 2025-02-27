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

export type ComplexNotificationDTO<T = undefined> = NotificationDTO & {
  params: T;
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

export abstract class ComplexNotification<T> extends Notification {
  readonly params: T;

  constructor({ params, ...data }: ComplexNotificationDTO<T>) {
    super(data);
    this.params = params;
  }

  getDTO() {
    return {
      ...super.getDTO(),
      params: this.params,
    };
  }
}
