import { Notification } from "../../../notification/models/Notification";

export type NotificationObserverEvent = (data: {
  notification?: Notification;
  totalNotRead: number;
}) => Promise<void>;

class NotificationObserver {
  private observers: Map<string, NotificationObserverEvent> = new Map();

  addObserver(userId: string, observer: NotificationObserverEvent) {
    this.observers.set(userId, observer);
  }

  async notify(
    userId: string,
    {
      notification,
      totalNotRead = 0,
    }: { notification?: Notification; totalNotRead?: number },
  ) {
    if (this.observers.has(userId)) {
      const executeObserver = this.observers.get(userId);
      if (!executeObserver) return;
      await executeObserver({ notification, totalNotRead });
    }
  }

  list() {
    return Array.from(this.observers);
  }
}

const notificationObserver = new NotificationObserver();

export { notificationObserver };
