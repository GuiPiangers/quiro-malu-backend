import { SendPushNotificationUseCase } from "./SendPushNotificationUseCase";
import { createMockPushNotificationProvider } from "../../../../repositories/_mocks/PushNotificationProviderMock";

describe("SendPushNotificationUseCase", () => {
  let pushNotificationProvider: ReturnType<
    typeof createMockPushNotificationProvider
  >;
  let useCase: SendPushNotificationUseCase;

  const mockSubscription = {
    endpoint: "test",
    keys: { auth: "auth", p256dh: "p256dh" },
  };
  const baseNotificationData = {
    title: "Test Title",
    type: "test",
    message: "Test Message",
  };

  beforeEach(() => {
    pushNotificationProvider = createMockPushNotificationProvider();
    useCase = new SendPushNotificationUseCase(pushNotificationProvider);
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should send notifications to all allowed subscriptions", async () => {
      pushNotificationProvider.getAllowedSubscriptions.mockResolvedValue({
        subscriptions: [mockSubscription, mockSubscription],
        userId: "user1",
      });

      await useCase.execute({
        userId: "user1",
        notificationData: baseNotificationData,
      });

      expect(
        pushNotificationProvider.getAllowedSubscriptions,
      ).toHaveBeenCalledWith({ userId: "user1" });
      expect(pushNotificationProvider.send).toHaveBeenCalledTimes(2);
    });

    it("should not send notifications if no subscriptions found", async () => {
      pushNotificationProvider.getAllowedSubscriptions.mockResolvedValue(
        undefined as any,
      );

      await useCase.execute({
        userId: "user1",
        notificationData: baseNotificationData,
      });

      expect(pushNotificationProvider.send).not.toHaveBeenCalled();
    });
  });
});
