import { createMockLocationRepository } from "../../../../repositories/_mocks/LocationRepositoryMock";
import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { GetPatientUseCase } from "./GetPatientUseCase";

describe("getPatientUseCase", () => {
  let getPatientUseCase: GetPatientUseCase;
  const mockPatientRepository = createMockPatientRepository();
  const mockLocationRepository = createMockLocationRepository();

  beforeEach(() => {
    vi.clearAllMocks();
    getPatientUseCase = new GetPatientUseCase(
      mockPatientRepository,
      mockLocationRepository,
    );
  });

  describe("execute", () => {
    it("should get patient data", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";

      mockPatientRepository.getById.mockResolvedValue([
        {
          name: "patientName",
          phone: "patientPhone",
        },
      ]);

      mockLocationRepository.getLocation.mockResolvedValue([]);

      const result = await getPatientUseCase.execute(patientId, clinicId);

      expect(mockPatientRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockPatientRepository.getById).toHaveBeenCalledWith(
        patientId,
        clinicId,
      );
      expect(mockLocationRepository.getLocation).toHaveBeenCalledTimes(1);
      expect(mockLocationRepository.getLocation).toHaveBeenCalledWith(
        patientId,
        clinicId,
      );

      expect(result).toEqual({
        name: "patientName",
        phone: "patientPhone",
      });
    });

    it("should get patient data and location data if location exists on Database", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const locationData = {
        state: "state",
        address: "address",
        cep: "cep",
        city: "city",
        neighborhood: "neighborhood",
      };

      mockPatientRepository.getById.mockResolvedValue([
        {
          name: "patientName",
          phone: "patientPhone",
        },
      ]);

      mockLocationRepository.getLocation.mockResolvedValue([locationData]);

      const result = await getPatientUseCase.execute(patientId, clinicId);

      expect(mockPatientRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockPatientRepository.getById).toHaveBeenCalledWith(
        patientId,
        clinicId,
      );
      expect(mockLocationRepository.getLocation).toHaveBeenCalledTimes(1);
      expect(mockLocationRepository.getLocation).toHaveBeenCalledWith(
        patientId,
        clinicId,
      );

      expect(result).toEqual({
        name: "patientName",
        phone: "patientPhone",
        location: locationData,
      });
    });

    it("should propagate an error if the patient repository get method throws", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const errorMessage = "Failed to get patient";

      mockPatientRepository.getById.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        getPatientUseCase.execute(patientId, clinicId),
      ).rejects.toThrow(errorMessage);
    });

    it("should propagate an error if the location repository get method throws", async () => {
      const patientId = "test-patient-id";
      const clinicId = "test-user-id";
      const errorMessage = "Failed to get patient";

      mockLocationRepository.getLocation.mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await expect(
        getPatientUseCase.execute(patientId, clinicId),
      ).rejects.toThrow(errorMessage);
    });
  });
});
