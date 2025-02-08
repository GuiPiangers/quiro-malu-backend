import { Notification } from "../../../notification/models/Notification";

export type Observer = (
  notification: Notification,
  totalNotRead: number,
) => Promise<void>;

class NotificationObserver {
  private observers = new Set<Observer>();

  addObserver(observer: Observer) {
    this.observers.add(observer);
  }

  async notify(notification: Notification, totalNotRead = 0) {
    const observers = Array.from(this.observers);

    const executeObserver = observers.map((observer) =>
      observer(notification, totalNotRead),
    );
    await Promise.allSettled(executeObserver);
  }
}

const notificationObserver = new NotificationObserver();

export { notificationObserver };
