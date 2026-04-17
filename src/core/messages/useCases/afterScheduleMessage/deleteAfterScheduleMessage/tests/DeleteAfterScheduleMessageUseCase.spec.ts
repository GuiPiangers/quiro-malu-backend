import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { DeleteAfterScheduleMessageUseCase } from "../DeleteAfterScheduleMessageUseCase";

describe("DeleteAfterScheduleMessageUseCase", () => {
  const makeSut = () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const afterScheduleQueue = {
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const appEventListener = { emit: jest.fn() };

    const sut = new DeleteAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
      schedulingRepository,
      afterScheduleQueue as any,
      appEventListener as any,
    );

    return {
      sut,
      afterScheduleMessageRepository,
      schedulingRepository,
      afterScheduleQueue,
      appEventListener,
    };
  };

  it("deve lançar ApiError 404 quando a mensagem não existir", async () => {
    const { sut, afterScheduleMessageRepository } = makeSut();
    afterScheduleMessageRepository.getById.mockResolvedValue(null);

    await expect(sut.execute({ id: "msg-1", userId: "user-1" })).rejects.toThrow(
      ApiError,
    );

    expect(afterScheduleMessageRepository.delete).not.toHaveBeenCalled();
  });

  it("deve remover do banco, emitir evento e limpar jobs da fila", async () => {
    const {
      sut,
      afterScheduleMessageRepository,
      schedulingRepository,
      afterScheduleQueue,
      appEventListener,
    } = makeSut();

    afterScheduleMessageRepository.getById.mockResolvedValue({
      id: "msg-1",
      userId: "user-1",
      name: "x",
      minutesAfterSchedule: 30,
      textTemplate: "t",
      isActive: true,
    });
    afterScheduleMessageRepository.delete.mockResolvedValue(undefined);
    schedulingRepository.listIdsByUserId.mockResolvedValue(["sch-1", "sch-2"]);

    await sut.execute({ id: "msg-1", userId: "user-1" });

    expect(afterScheduleMessageRepository.delete).toHaveBeenCalledWith({
      id: "msg-1",
      userId: "user-1",
    });
    expect(appEventListener.emit).toHaveBeenCalledWith("afterScheduleMessageDelete", {
      id: "msg-1",
    });
    expect(schedulingRepository.listIdsByUserId).toHaveBeenCalledWith({
      userId: "user-1",
    });
    expect(afterScheduleQueue.remove).toHaveBeenCalledTimes(2);
    expect(afterScheduleQueue.remove).toHaveBeenCalledWith(
      "after-schedule_user-1_sch-1_msg-1".substring(0, 250),
    );
    expect(afterScheduleQueue.remove).toHaveBeenCalledWith(
      "after-schedule_user-1_sch-2_msg-1".substring(0, 250),
    );
  });
});
