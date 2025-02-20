import { createMockPushNotificationProvider } from "../../../../repositories/_mocks/PushNotificationProviderMock";
import { SubscribeNotificationUseCase } from "./subscribeNotificationUseCase";

describe("SubscribeNotificationUseCase", () => {
  let pushNotificationProvider: ReturnType<
    typeof createMockPushNotificationProvider
  >;
  let subscribeNotificationUseCase: SubscribeNotificationUseCase;

  beforeEach(() => {
    pushNotificationProvider = createMockPushNotificationProvider();
    subscribeNotificationUseCase = new SubscribeNotificationUseCase(
      pushNotificationProvider,
    );
    jest.clearAllMocks();
  });

  it("should not subscribe notification if it subscription was already registered", async () => {
    const mockSubscription = {
      endpoint: "test",
      keys: { auth: "auth", p256dh: "p256dh" },
    };

    pushNotificationProvider.getAllowedSubscriptions.mockResolvedValue({
      subscriptions: [mockSubscription],
      userId: "user1",
    });

    await subscribeNotificationUseCase.execute({
      subscription: mockSubscription,
      userId: "user1",
    });

    expect(pushNotificationProvider.subscribe).not.toHaveBeenCalled();
  });

  it("should subscribe notification with new subscription", async () => {
    const mockSubscription = {
      endpoint: "test1",
      keys: { auth: "auth", p256dh: "p256dh" },
    };

    pushNotificationProvider.getAllowedSubscriptions.mockResolvedValue(
      null as any,
    );

    await subscribeNotificationUseCase.execute({
      subscription: mockSubscription,
      userId: "user1",
    });

    expect(pushNotificationProvider.subscribe).toHaveBeenCalledTimes(1);
    expect(pushNotificationProvider.subscribe).toHaveBeenCalledWith({
      subscription: mockSubscription,
      userId: "user1",
      allowPushNotifications: true,
    });
  });

  it("should propagate the error if any errors throws", async () => {
    const mockSubscription = {
      endpoint: "test1",
      keys: { auth: "auth", p256dh: "p256dh" },
    };
    const error = "Erro na subscrição";

    pushNotificationProvider.getAllowedSubscriptions.mockRejectedValue(
      new Error(error),
    );

    await expect(
      subscribeNotificationUseCase.execute({
        subscription: mockSubscription,
        userId: "user1",
      }),
    ).rejects.toThrow(error);
  });
});
