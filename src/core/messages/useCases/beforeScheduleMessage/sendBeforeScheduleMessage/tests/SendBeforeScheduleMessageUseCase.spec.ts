import { createMockWhatsAppProvider } from "../../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { createMockBeforeScheduleMessageRepository } from "../../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { createMockWhatsAppInstanceRepository } from "../../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { IAppEventListener } from "../../../../../shared/observers/EventListener";
import { SendBeforeScheduleMessageUseCase } from "../sendBeforeScheduleMessageUseCase";
import { ApiError } from "../../../../../../utils/ApiError";

const instanceName = "clinic-user-1";

const registeredInstance = {
  id: "inst-1",
  userId: "user-1",
  instanceName,
};

function createAppEventListenerMock(): IAppEventListener {
  return { emit: jest.fn() };
}

function createMessageSendStrategyEnforcerMock() {
  return { isSendAllowed: jest.fn().mockResolvedValue(true) };
}

describe("SendBeforeScheduleMessageUseCase", () => {
  it("deve enviar mensagem renderizada quando config está ativa e provider está conectado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

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

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: true,
      providerMessageId: "wa-msg-1",
    });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
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

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        scheduleMessageType: "beforeSchedule",
        scheduleMessageConfigId: "cfg-1",
        message: "Olá Maria, consulta em 01/01/2025 às 10:00.",
        toPhone: "5551999999999",
        instanceName,
        status: "PENDING",
        providerMessageId: "wa-msg-1",
      }),
    );

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "beforeScheduleMessageSend",
      expect.objectContaining({
        userId: "user-1",
        patientId: "patient-1",
        schedulingId: "schedule-1",
        beforeScheduleMessageId: "cfg-1",
        instanceName,
        toPhone: "5551999999999",
        providerMessageId: "wa-msg-1",
      }),
    );
  });

  it("deve persistir log PENDING sem providerMessageId quando a API não retorna id", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "x",
      minutesBeforeSchedule: 60,
      textTemplate: "Oi {{nome_paciente}}",
      isActive: true,
    });
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");
    patientRepository.getById.mockResolvedValue([
      { id: "patient-1", name: "João", phone: "51988888888" } as any,
    ]);
    schedulingRepository.get.mockResolvedValue([
      {
        id: "schedule-1",
        patientId: "patient-1",
        date: "2025-01-01T10:00",
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
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PENDING",
        providerMessageId: null,
        message: "Oi João",
      }),
    );

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "beforeScheduleMessageSend",
      expect.objectContaining({
        providerMessageId: null,
      }),
    );
  });

  it("deve persistir log FAILED quando o provider retorna falha", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    beforeScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "x",
      minutesBeforeSchedule: 60,
      textTemplate: "x",
      isActive: true,
    });
    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");
    patientRepository.getById.mockResolvedValue([
      { id: "patient-1", name: "Maria", phone: "51999999999" } as any,
    ]);
    schedulingRepository.get.mockResolvedValue([
      { id: "schedule-1", patientId: "patient-1", status: "Agendado" } as any,
    ]);
    whatsAppProvider.sendMessage.mockResolvedValue({
      success: false,
      errorMessage: "timeout",
    });

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
        providerMessageId: null,
        errorMessage: "timeout",
      }),
    );
  });

  it("não deve enviar quando o agendamento está cancelado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

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
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });

  it("não deve enviar quando config está inativa", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

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
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(patientRepository.getById).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });

  it("não deve enviar quando config está ausente", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    beforeScheduleMessageRepository.getById.mockResolvedValue(null);

    const useCase = new SendBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      beforeScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar ApiError quando não existe instância registrada no banco", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

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
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
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
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });

  it("deve lançar ApiError quando o provider reporta WhatsApp desconectado", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

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
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
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
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });
});
