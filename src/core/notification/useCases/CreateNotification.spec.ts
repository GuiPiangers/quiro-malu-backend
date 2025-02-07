import { createMockNotificationRepository } from "../../../repositories/_mocks/NotificationRepositoryMock";
import { DateTime } from "../../shared/Date";
import { NotificationDOT } from "../models/Notification";
import CreateNotificationUseCase from "./createNotificationUseCase";

describe("CreateNotificationUseCase", () => {
  let createNotificationUseCase: CreateNotificationUseCase;
  const mockNotificationRepository: ReturnType<
    typeof createMockNotificationRepository
  > = createMockNotificationRepository();

  beforeEach(() => {
    jest.clearAllMocks();
    createNotificationUseCase = new CreateNotificationUseCase(
      mockNotificationRepository,
    );
  });

  const notification: NotificationDOT & { userId: string } = {
    createdAt: DateTime.now(),
    message: "Message",
    read: false,
    title: "Title",
    type: "type",
    userId: "test-user-id",
    id: "test-notification-id",
  };

  it("Should call save method of notificationRepository with correct params", async () => {
    await createNotificationUseCase.execute(notification);

    expect(mockNotificationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockNotificationRepository.save).toHaveBeenCalledWith(notification);
  });

  it("Should propagate Error if repository save method throws", async () => {
    const errorMessage = "Error deleting Finance";

    mockNotificationRepository.save.mockRejectedValue(new Error(errorMessage));

    await expect(
      createNotificationUseCase.execute(notification),
    ).rejects.toThrow(errorMessage);
  });
});
