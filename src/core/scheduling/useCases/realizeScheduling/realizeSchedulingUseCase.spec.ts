import { RealizeSchedulingUseCase } from "./realizeSchedulingUseCase";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { IProgressRepository } from "../../../../repositories/progress/IProgressRepository";
import { ProgressDTO } from "../../../patients/models/Progress";
import { ApiError } from "../../../../utils/ApiError";

const mockedSchedulingRepository = {
  update: jest.fn(),
};

const mockedProgressRepository = {
  getByScheduling: jest.fn(),
};

describe("Realize scheduling use case", () => {
  let realizeSchedulingUseCase: RealizeSchedulingUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    realizeSchedulingUseCase = new RealizeSchedulingUseCase(
      mockedSchedulingRepository as unknown as ISchedulingRepository,
      mockedProgressRepository as unknown as IProgressRepository,
    );
  });
  it("Should be able to set scheduling Realized if a progress has been associated to scheduling", async () => {
    const realizeSchedulingData = {
      userId: "userId1",
      patientId: "patientId1",
      schedulingId: "schedulingId1",
    };

    mockedProgressRepository.getByScheduling.mockResolvedValue([
      {
        patientId: realizeSchedulingData.patientId,
        schedulingId: realizeSchedulingData.schedulingId,
      } as ProgressDTO,
    ]);

    mockedSchedulingRepository.update.mockResolvedValue(undefined);

    const result = await realizeSchedulingUseCase.execute(
      realizeSchedulingData,
    );

    expect(mockedProgressRepository.getByScheduling).toHaveBeenCalledWith({
      schedulingId: realizeSchedulingData.schedulingId,
      patientId: realizeSchedulingData.patientId,
      userId: realizeSchedulingData.userId,
    });

    expect(mockedSchedulingRepository.update).toHaveBeenCalledWith({
      id: realizeSchedulingData.schedulingId,
      userId: realizeSchedulingData.userId,
      status: "Atendido",
    });

    expect(result).toBeUndefined();
  });
  it("Should throw an error if try to realize a scheduling without a progress has been associated to scheduling", async () => {
    const realizeSchedulingData = {
      userId: "userId1",
      patientId: "patientId1",
      schedulingId: "schedulingId1",
    };

    mockedProgressRepository.getByScheduling.mockResolvedValue([]);

    // expect(mockedProgressRepository.getByScheduling).toHaveBeenCalledWith({
    //   schedulingId: realizeSchedulingData.schedulingId,
    //   patientId: realizeSchedulingData.patientId,
    //   userId: realizeSchedulingData.userId,
    // });

    await expect(
      realizeSchedulingUseCase.execute(realizeSchedulingData),
    ).rejects.toThrow(ApiError);

    try {
      await realizeSchedulingUseCase.execute(realizeSchedulingData);
    } catch (error: unknown) {
      expect((error as ApiError).message).toBe(
        "A evolução deve ser salva para poder realizar a consulta",
      );
      expect((error as ApiError).statusCode).toBe(401);
    }

    expect(mockedSchedulingRepository.update).not.toHaveBeenCalled();
  });
});
