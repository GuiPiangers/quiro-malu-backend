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
    const { subscriptions } =
      (await this.pushNotificationProvider.getSubscriptions({
        userId,
      })) || { subscriptions: [] };

    console.log("chegou qui");

    if (subscriptions.every((sub) => sub.endpoint !== subscription.endpoint))
      await this.pushNotificationProvider.subscribe({ subscription, userId });
  }
}
