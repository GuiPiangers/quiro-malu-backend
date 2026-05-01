import { createMockWhatsAppProvider } from "../../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../../../repositories/_mocks/SchedulingRepositoryMock";
import { createMockWhatsAppInstanceRepository } from "../../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { IAppEventListener } from "../../../../../shared/observers/EventListener";
import { SendAfterScheduleMessageUseCase } from "../sendAfterScheduleMessageUseCase";

const instanceName = "clinic-user-1";

const registeredInstance = {
  id: "inst-1",
  userId: "user-1",
  instanceName,
};

function createAppEventListenerMock(): IAppEventListener {
  return { emit: vi.fn() };
}

function createMessageSendStrategyEnforcerMock() {
  return { isSendAllowed: vi.fn().mockResolvedValue(true) };
}

describe("SendAfterScheduleMessageUseCase", () => {
  it("deve enviar mensagem quando status é Atendido", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    whatsAppMessageLogRepository.getBySchedulingAndCampaignId.mockResolvedValue(
      null,
    );

    afterScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Envio",
      minutesAfterSchedule: 60,
      textTemplate: "Obrigado {{nome_paciente}} pela consulta em {{data_consulta}} às {{horario_consulta}}.",
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
        status: "Atendido",
      } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: true,
      providerMessageId: "wa-msg-1",
    });

    const useCase = new SendAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
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
      afterScheduleMessageId: "cfg-1",
    });

    expect(
      whatsAppMessageLogRepository.getBySchedulingAndCampaignId,
    ).toHaveBeenCalledWith({
      schedulingId: "schedule-1",
      campaignId: "cfg-1",
    });
    expect(whatsAppProvider.sendMessage).toHaveBeenCalledWith({
      to: "5551999999999",
      body: "Obrigado Maria pela consulta em 01/01/2025 às 10:00.",
      instanceName,
    });

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        scheduleMessageType: "afterSchedule",
        scheduleMessageConfigId: "cfg-1",
        status: "PENDING",
        providerMessageId: "wa-msg-1",
      }),
    );

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "afterScheduleMessageSend",
      expect.objectContaining({
        afterScheduleMessageId: "cfg-1",
        providerMessageId: "wa-msg-1",
      }),
    );
  });

  it("não deve reenviar quando já existe log para o mesmo agendamento e campanha", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    whatsAppMessageLogRepository.getBySchedulingAndCampaignId.mockResolvedValue({
      id: "log-existente",
      schedulingId: "schedule-1",
      scheduleMessageConfigId: "cfg-1",
    } as any);

    const useCase = new SendAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
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
      afterScheduleMessageId: "cfg-1",
    });

    expect(
      whatsAppMessageLogRepository.getBySchedulingAndCampaignId,
    ).toHaveBeenCalledWith({
      schedulingId: "schedule-1",
      campaignId: "cfg-1",
    });
    expect(schedulingRepository.get).not.toHaveBeenCalled();
    expect(afterScheduleMessageRepository.getById).not.toHaveBeenCalled();
    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
    expect(appEventListener.emit).not.toHaveBeenCalled();
  });

  it("não deve enviar quando status não é Atendido", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    whatsAppMessageLogRepository.getBySchedulingAndCampaignId.mockResolvedValue(
      null,
    );

    afterScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Envio",
      minutesAfterSchedule: 60,
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
        status: "Agendado",
      } as any,
    ]);

    const useCase = new SendAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
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
      afterScheduleMessageId: "cfg-1",
    });

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(patientRepository.getById).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
    expect(appEventListener.emit).not.toHaveBeenCalled();
  });

  it("não deve enviar quando a estratégia (isSendAllowed) retorna false", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();
    const patientRepository = createMockPatientRepository();
    const schedulingRepository = createMockSchedulingRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();
    const messageSendStrategyEnforcer = {
      isSendAllowed: vi.fn().mockResolvedValue(false),
    };

    whatsAppMessageLogRepository.getBySchedulingAndCampaignId.mockResolvedValue(
      null,
    );

    afterScheduleMessageRepository.getById.mockResolvedValue({
      id: "cfg-1",
      userId: "user-1",
      name: "Envio",
      minutesAfterSchedule: 60,
      textTemplate: "Obrigado {{nome_paciente}}",
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
        status: "Atendido",
      } as any,
    ]);

    const useCase = new SendAfterScheduleMessageUseCase(
      afterScheduleMessageRepository,
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      messageSendStrategyEnforcer as any,
    );

    await useCase.execute({
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "schedule-1",
      afterScheduleMessageId: "cfg-1",
    });

    expect(messageSendStrategyEnforcer.isSendAllowed).toHaveBeenCalledWith({
      userId: "user-1",
      campaignId: "cfg-1",
      patientId: "patient-1",
    });
    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
    expect(appEventListener.emit).not.toHaveBeenCalled();
  });
});
