import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { Scheduling } from "../../../scheduling/models/Scheduling";
import { AfterAppointmentAudienceResolver } from "../resolvers/AfterAppointmentAudienceResolver";
import { BeforeAppointmentAudienceResolver } from "../resolvers/BeforeAppointmentAudienceResolver";

describe("Appointment audience resolvers", () => {
  it("AfterAppointmentAudienceResolver should call listFromNowWithinMinutes", async () => {
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();

    schedulingRepository.listFromNowWithinMinutes.mockResolvedValue([
      new Scheduling({ patientId: "p1" } as any),
    ]);

    patientRepository.getById.mockResolvedValue([
      { id: "p1", name: "P1", phone: "(51) 90000 9000" } as any,
    ]);

    const resolver = new AfterAppointmentAudienceResolver(
      schedulingRepository,
      patientRepository,
    );

    const result = await resolver.resolve({
      userId: "user-1",
      audienceOffsetMinutes: 30,
    } as any);

    expect(schedulingRepository.listFromNowWithinMinutes).toHaveBeenCalledWith({
      userId: "user-1",
      offsetMinutes: 30,
    });
    expect(result).toHaveLength(1);
  });

  it("BeforeAppointmentAudienceResolver should call listScheduledInMinutes", async () => {
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();

    schedulingRepository.listScheduledInMinutes.mockResolvedValue([
      new Scheduling({ patientId: "p1" } as any),
    ]);

    patientRepository.getById.mockResolvedValue([
      { id: "p1", name: "P1", phone: "(51) 90000 9000" } as any,
    ]);

    const resolver = new BeforeAppointmentAudienceResolver(
      schedulingRepository,
      patientRepository,
    );

    const result = await resolver.resolve({
      userId: "user-1",
      audienceOffsetMinutes: 120,
    } as any);

    expect(schedulingRepository.listScheduledInMinutes).toHaveBeenCalledWith({
      userId: "user-1",
      offsetMinutes: 120,
    });
    expect(result).toHaveLength(1);
  });
});
