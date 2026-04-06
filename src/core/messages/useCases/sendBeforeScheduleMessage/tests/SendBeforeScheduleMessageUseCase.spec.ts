import { createMockWhatsAppProvider } from "../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { createMockPatientRepository } from "../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { createMockWhatsAppInstanceRepository } from "../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { SendBeforeScheduleMessageUseCase } from "../sendBeforeScheduleMessageUseCase";
import { ApiError } from "../../../../../utils/ApiError";

const instanceName = "clinic-user-1";

const registeredInstance = {
  id: "inst-1",
  userId: "user-1",
  instanceName,
};

describe("SendBeforeScheduleMessageUseCase", () => {
  it("deve enviar mensagem renderizada quando config está ativa e provider está conectado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Envio",
      minutesBeforeSchedule: 60,
      textTemplate: "Olá {{nome_paciente}}, consulta em {{data_consulta}} às {{horario_consulta}}.",
      isActive: true,
    });

    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    patientRepository.getById.mockResolvedValue([
      { id: "patient-1", name: "Maria", phone: "(51) 99999 9999" } as any,
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        id: "schedule-1",
        patientId: "patient-1",
        date: "2025-01-01T10:00",
        service: "Consulta",
        status: "Agendado",
      } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.getConnectionState).toHaveBeenCalledWith(instanceName);
    expect(whatsAppProvider.sendMessage).toHaveBeenCalledWith({
      to: "5551999999999",
      body: "Olá Maria, consulta em 01/01/2025 às 10:00.",
      instanceName,
    });
  });

  it("não deve enviar quando o agendamento está cancelado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Envio",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: true,
    });

    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    patientRepository.getById.mockResolvedValue([
      { id: "patient-1", name: "Maria", phone: "(51) 99999 9999" } as any,
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        id: "schedule-1",
        patientId: "patient-1",
        date: "2025-01-01T10:00",
        service: "Consulta",
        status: "Cancelado",
      } as any,
    ]);

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
  });

  it("não deve enviar quando config está inativa", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Inativa",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: false,
    });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
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

  it("não deve enviar quando config está ausente", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue(null);

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
  });

  it("deve lançar ApiError quando não existe instância registrada no banco", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "x",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: true,
    });
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(null);

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
    );

    await expect(
      useCase.execute({
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
      }),
    ).rejects.toThrow(ApiError);

    expect(whatsAppProvider.getConnectionState).not.toHaveBeenCalled();
    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
  });

  it("deve lançar ApiError quando o provider reporta WhatsApp desconectado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "x",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: true,
    });
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("close");

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
    );

    await expect(
      useCase.execute({
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
      }),
    ).rejects.toThrow(ApiError);

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
  });
});
