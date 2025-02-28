import { Entity } from "../../shared/Entity";

export type PushNotificationDTO = {
  id?: string;
  type: string;
  title: string;
  message: string;
};

export class PushNotification extends Entity {
  readonly title: string;
  readonly message: string;
  readonly type: string;

  constructor({ id, message, title, type }: PushNotificationDTO) {
    super(id);
    this.title = title;
    this.message = message;
    this.type = type;
  }

  getDTO() {
    return {
      message: this.message,
      title: this.title,
      id: this.id,
      type: this.type,
    };
  }
}
