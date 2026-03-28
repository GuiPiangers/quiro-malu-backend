import { createMockMessageLogRepository } from "../../../../repositories/_mocks/MessageLogRepositoryMock";
import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { createMockWhatsAppProvider } from "../../../../providers/whatsapp/_mocks/WhatsAppProviderMock";
import { SendMessageUseCase } from "./sendMessageUseCase";

describe("sendMessageUseCase", () => {
  let patientRepository: ReturnType<typeof createMockPatientRepository>;
  let schedulingRepository: ReturnType<typeof createMockSchedulingRepository>;
  let whatsAppProvider: ReturnType<typeof createMockWhatsAppProvider>;
  let messageLogRepository: ReturnType<typeof createMockMessageLogRepository>;
  let sendMessageUseCase: SendMessageUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    patientRepository = createMockPatientRepository();
    schedulingRepository = createMockSchedulingRepository();
    whatsAppProvider = createMockWhatsAppProvider();
    messageLogRepository = createMockMessageLogRepository();

    sendMessageUseCase = new SendMessageUseCase(
      patientRepository,
      schedulingRepository,
      whatsAppProvider,
      messageLogRepository,
      "clinic-test",
    );
  });

  it("Deve chamar patientRepository.getById e buscar os dados do paciente", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      origin: "CAMPAIGN",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá, seja muito bem vindo a clinica",
      },
    });

    expect(patientRepository.getById).toBeCalledTimes(1);
    expect(patientRepository.getById).toBeCalledWith("patient-id", "user-id");
  });

  it("Não deve chamar schedulingRepository.get se o schedulingId não for passado", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);
    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      origin: "CAMPAIGN",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá, seja muito bem vindo a clinica",
      },
    });

    expect(schedulingRepository.get).not.toHaveBeenCalled();
  });

  it("Deve chamar schedulingRepository.get e buscar os dados da consulta se o schedulingId for passado", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        patient: "Nome Paciente",
        phone: "(51) 90000 9000",
        id: "scheduling-id",
        patientId: "patient-id",
      } as any,
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      schedulingId: "scheduling-id",
      origin: "APPOINTMENT_REMINDER",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Lembrete",
        triggers: [{ event: "createSchedule" }],
        templateMessage: "Olá, lembrete",
      },
    });

    expect(schedulingRepository.get).toBeCalledTimes(1);
    expect(schedulingRepository.get).toBeCalledWith({
      userId: "user-id",
      id: "scheduling-id",
    });
  });

  it("Deve chamar whatsAppProvider.sendMessage com telefone internacional e body renderizado", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({ success: true });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      origin: "CAMPAIGN",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá {{nome_paciente}}",
      },
    });

    expect(whatsAppProvider.sendMessage).toHaveBeenCalledWith({
      to: "5551900009000",
      body: "Olá Nome Paciente",
      instanceName: "clinic-test",
    });
  });

  it("Deve salvar MessageLog com status SENT quando o provider retornar success: true", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: true,
      providerMessageId: "provider-id",
    });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      origin: "CAMPAIGN",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá {{nome_paciente}}",
      },
    });

    expect(messageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "SENT",
        providerMessageId: "provider-id",
        campaignId: "campaign-id",
        patientId: "patient-id",
        origin: "CAMPAIGN",
        renderedBody: "Olá Nome Paciente",
      }),
    );
  });

  it("Deve salvar MessageLog com status FAILED quando o provider retornar success: false", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    whatsAppProvider.sendMessage.mockResolvedValue({
      success: false,
      errorMessage: "Erro no provider",
    });

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      origin: "CAMPAIGN",
      messageCampaign: {
        id: "campaign-id",
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá {{nome_paciente}}",
      },
    });

    expect(messageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
        errorMessage: "Erro no provider",
        campaignId: "campaign-id",
        patientId: "patient-id",
        origin: "CAMPAIGN",
      }),
    );
  });

  it("Deve evitar que erros ao enviar mensagem se propaguem", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    const errorMessage = "Erro de teste";

    whatsAppProvider.sendMessage.mockRejectedValue(new Error(errorMessage));

    await expect(
      sendMessageUseCase.execute({
        userId: "user-id",
        patientId: "patient-id",
        origin: "CAMPAIGN",
        messageCampaign: {
          id: "campaign-id",
          active: true,
          name: "Boas vindas",
          triggers: [{ event: "createPatient" }],
          templateMessage: "Olá, seja muito bem vindo a clinica.",
        },
      }),
    ).resolves.not.toThrowError();

    expect(messageLogRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
        errorMessage,
      }),
    );
  });
});
