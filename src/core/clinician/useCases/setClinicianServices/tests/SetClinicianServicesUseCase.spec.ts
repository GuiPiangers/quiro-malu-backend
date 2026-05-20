import { Clinician } from "../../../models/Clinician";
import { createMockClinicianRepository } from "../../../../../repositories/_mocks/ClinicianRepositoryMock";
import { createMockServiceRepository } from "../../../../../repositories/_mocks/ServiceRepositoryMock";
import { SetClinicianServicesUseCase } from "../SetClinicianServicesUseCase";

const bcryptHash =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

describe("SetClinicianServicesUseCase", () => {
  const clinicId = "00000000-0000-4000-8000-000000000001";
  const clinicianId = "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee";
  const serviceId = "bbbbbbbb-bbbb-4ccc-dddd-eeeeeeeeeeee";

  const clinicianRepository = createMockClinicianRepository();
  const serviceRepository = createMockServiceRepository();
  let useCase: SetClinicianServicesUseCase;

  const baseClinician = () =>
    new Clinician({
      id: clinicianId,
      name: "Dr. Ana",
      email: "ana@teste.com",
      phone: "(51) 99999 9999",
      password: bcryptHash,
      clinicId,
      roleId: "role-1",
      services: [],
    });

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new SetClinicianServicesUseCase(
      clinicianRepository,
      serviceRepository,
    );
    serviceRepository.get.mockResolvedValue({
      id: serviceId,
      name: "Sessão",
      value: 100,
      duration: 3600,
    });
    clinicianRepository.setServices.mockResolvedValue(undefined);
  });

  it("replaces services and returns updated clinician", async () => {
    const before = baseClinician();
    const after = new Clinician({
      ...before.toClinicianDTO(),
      password: bcryptHash,
      services: [{ id: serviceId, name: "Sessão", value: 100, duration: 3600 }],
    });

    clinicianRepository.findById
      .mockResolvedValueOnce(before)
      .mockResolvedValueOnce(after);

    const result = await useCase.execute(
      { clinicianId, services: [{ serviceId }] },
      clinicId,
    );

    expect(clinicianRepository.setServices).toHaveBeenCalledWith({
      id: clinicianId,
      clinicId,
      services: [{ id: serviceId, name: "Sessão", value: 100, duration: 3600 }],
    });
    expect(result.services).toHaveLength(1);
    expect(result.services[0].id).toBe(serviceId);
  });

  it("allows empty list to clear all services", async () => {
    const clinician = baseClinician();
    clinicianRepository.findById.mockResolvedValue(clinician);

    await useCase.execute({ clinicianId, services: [] }, clinicId);

    expect(clinicianRepository.setServices).toHaveBeenCalledWith({
      id: clinicianId,
      clinicId,
      services: [],
    });
  });

  it("deduplicates service ids", async () => {
    const clinician = baseClinician();
    clinicianRepository.findById.mockResolvedValue(clinician);

    await useCase.execute(
      {
        clinicianId,
        services: [{ serviceId }, { serviceId }],
      },
      clinicId,
    );

    expect(serviceRepository.get).toHaveBeenCalledTimes(1);
  });

  it("throws when clinician not found", async () => {
    clinicianRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ clinicianId, services: [{ serviceId }] }, clinicId),
    ).rejects.toThrow("Clínico não encontrado");

    expect(clinicianRepository.setServices).not.toHaveBeenCalled();
  });

  it("throws when service not in clinic", async () => {
    clinicianRepository.findById.mockResolvedValue(baseClinician());
    serviceRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute({ clinicianId, services: [{ serviceId }] }, clinicId),
    ).rejects.toThrow("Serviço não encontrado na clínica");

    expect(clinicianRepository.setServices).not.toHaveBeenCalled();
  });
});

export {};
