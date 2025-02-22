import { Notification } from "../../../notification/models/Notification";

export type NotificationObserverEvent = (
  notification: Notification,
  totalNotRead: number,
) => Promise<void>;

class NotificationObserver {
  private observers: Map<string, NotificationObserverEvent> = new Map();

  addObserver(key: string, observer: NotificationObserverEvent) {
    this.observers.set(key, observer);
  }

  async notify(
    key: string,
    {
      notification,
      totalNotRead = 0,
    }: { notification: Notification; totalNotRead?: number },
  ) {
    if (this.observers.has(key)) {
      const executeObserver = this.observers.get(key);
      if (!executeObserver) return;
      await executeObserver(notification, totalNotRead);
    }
  }

  list() {
    return Array.from(this.observers);
  }
}

const notificationObserver = new NotificationObserver();

export { notificationObserver };
