import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { createMockPatientRepository } from "../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { SendBeforeScheduleMessageUseCase } from "../sendBeforeScheduleMessageUseCase";

describe("SendBeforeScheduleMessageUseCase", () => {
  it("should send a rendered message when config is active", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      minutesBeforeSchedule: 60,
      textTemplate: "Olá {{nome}}, sua consulta é {{data_consulta}}.",
      isActive: true,
    });

    patientRepository.getById.mockResolvedValue([
      {
        id: "patient-1",
        name: "Maria",
        phone: "(51) 99999 9999",
      } as any,
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        id: "schedule-1",
        patientId: "patient-1",
        date: "2025-01-01T10:00",
        service: "Consulta",
        status: "Agendado",
        patient: "Maria",
        phone: "(51) 99999 9999",
      } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).toHaveBeenCalledWith({
      to: "5551999999999",
      body: "Olá Maria, sua consulta é 2025-01-01 às 10:00.",
    });
  });

  it("should not send when config is inactive", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: false,
    });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(patientRepository.getById).not.toHaveBeenCalled();
  });

  it("should not send when config is missing", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();

    beforeScheduleMessageRepository.getById.mockResolvedValue(null);

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
  });
});
