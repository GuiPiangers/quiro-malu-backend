import { createMockBeforeScheduleMessageRepository } from "../../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { DeleteBeforeScheduleMessageUseCase } from "../DeleteBeforeScheduleMessageUseCase";

describe("DeleteBeforeScheduleMessageUseCase", () => {
  const makeSut = () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const beforeScheduleQueue = {
      remove: vi.fn().mockResolvedValue(undefined),
    };
    const appEventListener = { emit: vi.fn() };

    const sut = new DeleteBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      schedulingRepository,
      beforeScheduleQueue as any,
      appEventListener as any,
    );

    return {
      sut,
      beforeScheduleMessageRepository,
      schedulingRepository,
      beforeScheduleQueue,
      appEventListener,
    };
  };

  it("deve lançar ApiError 404 quando a mensagem não existir", async () => {
    const { sut, beforeScheduleMessageRepository } = makeSut();
    beforeScheduleMessageRepository.getById.mockResolvedValue(null);

    await expect(
      sut.execute({ id: "msg-1", userId: "user-1" }),
    ).rejects.toThrow(ApiError);

    expect(beforeScheduleMessageRepository.delete).not.toHaveBeenCalled();
  });

  it("deve remover do banco, emitir evento e limpar jobs da fila", async () => {
    const {
      sut,
      beforeScheduleMessageRepository,
      schedulingRepository,
      beforeScheduleQueue,
      appEventListener,
    } = makeSut();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "msg-1",
      userId: "user-1",
      name: "x",
      minutesBeforeSchedule: 30,
      textTemplate: "t",
      isActive: true,
    });
    beforeScheduleMessageRepository.delete.mockResolvedValue(undefined);
    schedulingRepository.listIdsByUserId.mockResolvedValue(["sch-1", "sch-2"]);

    await sut.execute({ id: "msg-1", userId: "user-1" });

    expect(beforeScheduleMessageRepository.delete).toHaveBeenCalledWith({
      id: "msg-1",
      userId: "user-1",
    });
    expect(appEventListener.emit).toHaveBeenCalledWith(
      "beforeScheduleMessageDelete",
      { id: "msg-1" },
    );
    expect(schedulingRepository.listIdsByUserId).toHaveBeenCalledWith({
      userId: "user-1",
    });
    expect(beforeScheduleQueue.remove).toHaveBeenCalledTimes(2);
    expect(beforeScheduleQueue.remove).toHaveBeenCalledWith(
      "before-schedule_user-1_sch-1_msg-1".substring(0, 250),
    );
    expect(beforeScheduleQueue.remove).toHaveBeenCalledWith(
      "before-schedule_user-1_sch-2_msg-1".substring(0, 250),
    );
  });
});
