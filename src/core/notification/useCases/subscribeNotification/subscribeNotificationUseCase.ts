import {
  IPushNotificationProvider,
  Subscription,
} from "../../../../repositories/notification/IPushNotificationProvider";

export class SubscribeNotificationUseCase {
  constructor(private pushNotificationProvider: IPushNotificationProvider) {}

  async execute({
    subscription,
    userId,
  }: {
    userId: string;
    subscription: Subscription;
  }) {
    await this.pushNotificationProvider.subscribe({ subscription, userId });
  }
}
