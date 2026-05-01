import { createMockWhatsAppProvider } from "../../../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { createMockBirthdayMessageRepository } from "../../../../../../repositories/_mocks/BirthdayMessageRepositoryMock";
import { createMockPatientRepository } from "../../../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockWhatsAppInstanceRepository } from "../../../../../../repositories/_mocks/WhatsAppInstanceRepositoryMock";
import { createMockWhatsAppMessageLogRepository } from "../../../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import { DateTime } from "../../../../../shared/Date";
import { IAppEventListener } from "../../../../../shared/observers/EventListener";
import {
  buildBirthdayMessageLogId,
  SendBirthdayMessageUseCase,
} from "../sendBirthdayMessageUseCase";

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

const baseJob = {
  userId: "user-1",
  patientId: "patient-1",
  patientName: "Maria",
  patientPhone: "(51) 99999 9999",
  patientDateOfBirth: "1990-03-05",
  campaignId: "camp-1",
  campaignName: "Aniversário",
  textTemplate: "Parabéns {{nome_paciente}}!",
};

function expectedBirthdayLogId() {
  return buildBirthdayMessageLogId(DateTime.now().date, baseJob.patientId);
}

describe("SendBirthdayMessageUseCase", () => {
  it("deve enviar mensagem de aniversário e registrar log quando campanha ativa confere com o job", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const patientRepository = createMockPatientRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    birthdayMessageRepository.findActiveByUserId.mockResolvedValue({
      id: "camp-1",
      userId: "user-1",
      name: "Aniversário",
      textTemplate: "Parabéns {{nome_paciente}}!",
      isActive: true,
      sendTime: "09:00",
    });

    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    patientRepository.getById.mockResolvedValue([
      {
        id: "patient-1",
        name: "Maria",
        phone: "(51) 99999 9999",
        dateOfBirth: "1990-03-05",
      } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: true,
      providerMessageId: "wa-bday-1",
    });

    const useCase = new SendBirthdayMessageUseCase(
      birthdayMessageRepository,
      patientRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    const logId = expectedBirthdayLogId();

    await useCase.execute(baseJob);

    expect(whatsAppMessageLogRepository.findById).toHaveBeenCalledWith(logId);

    expect(whatsAppProvider.sendMessage).toHaveBeenCalledWith({
      to: "5551999999999",
      body: "Parabéns Maria!",
      instanceName,
    });

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: logId,
        schedulingId: "",
        scheduleMessageType: "birthday",
        scheduleMessageConfigId: "camp-1",
        status: "PENDING",
        providerMessageId: "wa-bday-1",
      }),
    );

    expect(appEventListener.emit).toHaveBeenCalledWith(
      "birthdayMessageSend",
      expect.objectContaining({
        birthdayMessageId: "camp-1",
        providerMessageId: "wa-bday-1",
        messageLogId: logId,
      }),
    );
  });

  it("não deve enviar quando já existir log de aniversário para o paciente na data atual", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const patientRepository = createMockPatientRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    const logId = expectedBirthdayLogId();
    whatsAppMessageLogRepository.findById.mockResolvedValue({
      id: logId,
      userId: "user-1",
      patientId: "patient-1",
      schedulingId: "",
      scheduleMessageType: "birthday",
      scheduleMessageConfigId: "camp-1",
      message: "x",
      toPhone: "5551999999999",
      instanceName,
      status: "PENDING",
      providerMessageId: "wa",
      errorMessage: null,
      sentAt: null,
      deliveredAt: null,
      readAt: null,
      createdAt: "",
      updatedAt: "",
    });

    birthdayMessageRepository.findActiveByUserId.mockResolvedValue({
      id: "camp-1",
      userId: "user-1",
      name: "Aniversário",
      textTemplate: "Parabéns {{nome_paciente}}!",
      isActive: true,
      sendTime: "09:00",
    });

    const useCase = new SendBirthdayMessageUseCase(
      birthdayMessageRepository,
      patientRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute(baseJob);

    expect(whatsAppMessageLogRepository.findById).toHaveBeenCalledWith(logId);
    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
    expect(appEventListener.emit).not.toHaveBeenCalled();
  });

  it("não deve enviar quando campanha ativa não coincide com campaignId do job", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const patientRepository = createMockPatientRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    birthdayMessageRepository.findActiveByUserId.mockResolvedValue({
      id: "outro-id",
      userId: "user-1",
      name: "X",
      textTemplate: "x",
      isActive: true,
      sendTime: "09:00",
    });

    const useCase = new SendBirthdayMessageUseCase(
      birthdayMessageRepository,
      patientRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    await useCase.execute(baseJob);

    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
  });

  it("deve persistir log FAILED quando envio falhar", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const patientRepository = createMockPatientRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();

    birthdayMessageRepository.findActiveByUserId.mockResolvedValue({
      id: "camp-1",
      userId: "user-1",
      name: "Aniversário",
      textTemplate: "Oi {{nome_paciente}}",
      isActive: true,
      sendTime: "10:00",
    });

    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    patientRepository.getById.mockResolvedValue([
      { id: "patient-1", name: "Maria", phone: "(51) 99999 9999", dateOfBirth: "1990-03-05" } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: false,
      errorMessage: "timeout",
    });

    const useCase = new SendBirthdayMessageUseCase(
      birthdayMessageRepository,
      patientRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      createMessageSendStrategyEnforcerMock() as any,
    );

    const logId = expectedBirthdayLogId();

    await useCase.execute(baseJob);

    expect(whatsAppMessageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: logId,
        scheduleMessageType: "birthday",
        status: "FAILED",
        errorMessage: "timeout",
      }),
    );

    expect(appEventListener.emit).not.toHaveBeenCalled();
  });

  it("não deve enviar quando a estratégia (isSendAllowed) retorna false", async () => {
    const birthdayMessageRepository = createMockBirthdayMessageRepository();
    const patientRepository = createMockPatientRepository();
    const whatsAppProvider = createMockWhatsAppProvider();
    const whatsAppInstanceRepository = createMockWhatsAppInstanceRepository();
    const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();
    const appEventListener = createAppEventListenerMock();
    const messageSendStrategyEnforcer = createMessageSendStrategyEnforcerMock();
    messageSendStrategyEnforcer.isSendAllowed.mockResolvedValue(false);

    birthdayMessageRepository.findActiveByUserId.mockResolvedValue({
      id: "camp-1",
      userId: "user-1",
      name: "Aniversário",
      textTemplate: "Parabéns {{nome_paciente}}!",
      isActive: true,
      sendTime: "09:00",
    });

    whatsAppInstanceRepository.getByUserId.mockResolvedValue(registeredInstance);
    whatsAppProvider.getConnectionState.mockResolvedValue("open");

    patientRepository.getById.mockResolvedValue([
      {
        id: "patient-1",
        name: "Maria",
        phone: "(51) 99999 9999",
        dateOfBirth: "1990-03-05",
      } as any,
    ]);

    const useCase = new SendBirthdayMessageUseCase(
      birthdayMessageRepository,
      patientRepository,
      whatsAppProvider,
      whatsAppInstanceRepository,
      whatsAppMessageLogRepository,
      appEventListener,
      messageSendStrategyEnforcer as any,
    );

    await useCase.execute(baseJob);

    expect(messageSendStrategyEnforcer.isSendAllowed).toHaveBeenCalledWith({
      userId: "user-1",
      campaignId: "camp-1",
      patientId: "patient-1",
    });
    expect(whatsAppProvider.sendMessage).not.toHaveBeenCalled();
    expect(whatsAppMessageLogRepository.save).not.toHaveBeenCalled();
    expect(appEventListener.emit).not.toHaveBeenCalled();
  });
});
