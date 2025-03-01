import { createMockNotificationRepository } from "../../../repositories/_mocks/NotificationRepositoryMock";
import { DateTime } from "../../shared/Date";
import { Notification, NotificationDTO } from "../models/Notification";
import SaveSendNotificationUseCase from "./sendAndSaveNotification/sendAndSaveNotification";

describe("CreateNotificationUseCase", () => {
  let saveAndSendNotificationUseCase: SaveSendNotificationUseCase;
  const mockNotificationRepository: ReturnType<
    typeof createMockNotificationRepository
  > = createMockNotificationRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    saveAndSendNotificationUseCase = new SaveSendNotificationUseCase(
      mockNotificationRepository,
    );
  });

  const notification: NotificationDTO = {
    createdAt: DateTime.now(),
    message: "Message",
    read: false,
    title: "Title",
    type: "default",
    id: "test-notification-id",
  };

  it("Should call save method of notificationRepository with correct params", async () => {
    const userId = "test-user-id";
    const simpleNotification = new Notification(notification);

    await saveAndSendNotificationUseCase.execute({
      userId,
      notification: simpleNotification,
    });

    expect(mockNotificationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockNotificationRepository.save).toHaveBeenCalledWith({
      ...notification,
      needAction: undefined,
      userId,
    });
  });

  it("Should propagate Error if repository save method throws", async () => {
    const errorMessage = "Error deleting Finance";
    const userId = "test-user-id";
    const simpleNotification = new Notification(notification);

    mockNotificationRepository.save.mockRejectedValue(new Error(errorMessage));

    await expect(
      saveAndSendNotificationUseCase.execute({
        userId,
        notification: simpleNotification,
      }),
    ).rejects.toThrow(errorMessage);
  });
});
