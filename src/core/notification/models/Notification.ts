import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { notificationTypes } from "./NotificationFactory";

export type NotificationDTO<T = undefined> = {
  id?: string;
  title: string;
  type: notificationTypes;
  message: string;
  createdAt?: DateTime;
  read?: boolean;
  actionNeeded?: boolean;
  params?: T;
};

export type ComplexNotificationDTO<T> = Omit<NotificationDTO<T>, "type"> & {
  params: T;
};

export class Notification extends Entity {
  readonly title: string;
  readonly type: notificationTypes;
  readonly message: string;
  readonly createdAt?: DateTime;
  readonly read: boolean;
  readonly actionNeeded?: boolean;

  constructor({
    id,
    createdAt,
    message,
    read,
    title,
    type,
    actionNeeded,
  }: NotificationDTO) {
    super(id);
    this.title = title;
    this.createdAt = createdAt;
    this.message = message;
    this.type = type;
    this.read = read !== undefined ? read : false;
    this.actionNeeded = actionNeeded;
  }

  getDTO() {
    return {
      createdAt: this.createdAt,
      message: this.message,
      read: this.read,
      title: this.title,
      type: this.type,
      id: this.id,
      actionNeeded: this.actionNeeded,
    };
  }
}

export abstract class ComplexNotification<T> extends Notification {
  readonly params: T;

  constructor({
    params,
    ...data
  }: ComplexNotificationDTO<T> & Pick<NotificationDTO<T>, "type">) {
    super({ ...data, actionNeeded: data.actionNeeded || true });
    this.params = params;
  }

  getDTO() {
    return {
      ...super.getDTO(),
      params: this.params,
    };
  }
}
