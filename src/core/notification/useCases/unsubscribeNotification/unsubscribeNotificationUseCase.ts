import { IPushNotificationProvider } from "../../../../repositories/notification/IPushNotificationProvider";

export class UnsubscribeNotificationUseCase {
  constructor(private pushNotificationProvider: IPushNotificationProvider) {}

  async execute({ userId }: { userId: string }) {
    await this.pushNotificationProvider.unsubscribe({ userId });
  }
}
