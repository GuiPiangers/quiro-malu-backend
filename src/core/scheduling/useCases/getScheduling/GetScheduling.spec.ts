import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { SchedulingWithPatientDTO } from "../../models/SchedulingWithPatient";
import { GetSchedulingUseCase } from "./GetSchedulingUseCase";

describe("getSchedulingUseCase", () => {
  let getSchedulingUseCase: GetSchedulingUseCase;
  const mockSchedulingRepository = createMockSchedulingRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    getSchedulingUseCase = new GetSchedulingUseCase(mockSchedulingRepository);
  });

  describe("execute", () => {
    it("should return the data of scheduling", async () => {
      const clinicId = "test-clinic-id";
      const id = "test-scheduling-id";

      const schedulingData: SchedulingWithPatientDTO = {
        id,
        patientId: "test-patient-id",
        date: "2025-01-01T10:00",
        duration: 3600,
        service: "service",
        status: "Atendido",
        patient: "papient name",
        phone: "(99) 99999 9999",
      };

      mockSchedulingRepository.get.mockResolvedValue([schedulingData]);

      const result = await getSchedulingUseCase.execute({ clinicId, id });

      expect(result).toEqual(schedulingData);
    });

    it("should call the repository get method with the correct params", async () => {
      const clinicId = "test-clinic-id";
      const id = "test-scheduling-id";

      mockSchedulingRepository.get.mockResolvedValue([
        {
          id,
          patientId: "test-patient-id",
          date: "2025-01-01T10:00",
          patient: "patient name",
          phone: "(99) 99999 9999",
        },
      ]);

      await getSchedulingUseCase.execute({ clinicId, id });

      expect(mockSchedulingRepository.get).toHaveBeenCalledTimes(1);
      expect(mockSchedulingRepository.get).toHaveBeenCalledWith({
        id,
        clinicId,
      });
    });

    it("should propagate an error if the repository method get throws", async () => {
      const clinicId = "test-clinic-id";
      const id = "test-scheduling-id";
      const errorMessage = "Failed to getQtdSchedulesByDay";

      mockSchedulingRepository.get.mockRejectedValue(new Error(errorMessage));

      await expect(
        getSchedulingUseCase.execute({ clinicId, id }),
      ).rejects.toThrow(errorMessage);
    });

    it("should throw 404 when scheduling is not found", async () => {
      mockSchedulingRepository.get.mockResolvedValue([]);

      await expect(
        getSchedulingUseCase.execute({
          clinicId: "test-clinic-id",
          id: "missing-id",
        }),
      ).rejects.toMatchObject({
        message: "Agendamento não encontrado",
        statusCode: 404,
      });
    });

    it.each([
      ["2026-05-04T08:00"],
      ["2026-05-04T00:00"],
      ["2030-12-31T23:59"],
      ["2025-06-15T14:05"],
    ])(
      "retorna a data exatamente como a string do agendamento (%s), sem reinterpretar fuso",
      async (bookedDate) => {
        const clinicId = "test-clinic-id";
        const id = "test-scheduling-id";

        const schedulingData: SchedulingWithPatientDTO = {
          id,
          patientId: "test-patient-id",
          date: bookedDate,
          duration: 3600,
          service: "Quiropraxia",
          status: "Agendado",
          patient: "Paciente",
          phone: "(11) 91111-1111",
        };

        mockSchedulingRepository.get.mockResolvedValue([schedulingData]);

        const result = await getSchedulingUseCase.execute({ clinicId, id });

        expect(result.date).toBe(bookedDate);
        expect(typeof result.date).toBe("string");
        expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      },
    );

    it("mantém a mesma string de data que o repositório retornou (contrato do cliente)", async () => {
      const clinicId = "test-clinic-id";
      const id = "test-scheduling-id";
      const clientBookedAt = "2031-03-20T16:30";

      mockSchedulingRepository.get.mockResolvedValue([
        {
          id,
          patientId: "test-patient-id",
          date: clientBookedAt,
          duration: 2700,
          service: "Retorno",
          status: "Agendado",
          patient: "Ana",
          phone: "(11) 98888-8888",
        },
      ]);

      const result = await getSchedulingUseCase.execute({ clinicId, id });

      expect(result.date).toBe(clientBookedAt);
    });
  });
});
