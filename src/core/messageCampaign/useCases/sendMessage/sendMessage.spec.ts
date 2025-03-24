import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { NotificationSendMessage } from "../../../notification/models/NotificationSendMessage";
import SaveSendNotificationUseCase from "../../../notification/useCases/sendAndSaveNotification/sendAndSaveNotification";
import { SendMessageUseCase } from "./sendMessageUseCase";

describe("sendMessageUseCase", () => {
  let patientRepository: ReturnType<typeof createMockPatientRepository>;
  let schedulingRepository: ReturnType<typeof createMockSchedulingRepository>;
  let sendMessageUseCase: SendMessageUseCase;
  let sendAndSaveNotificationUseCase: jest.Mocked<SaveSendNotificationUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();

    patientRepository = createMockPatientRepository();
    schedulingRepository = createMockSchedulingRepository();
    sendAndSaveNotificationUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SaveSendNotificationUseCase>;

    sendMessageUseCase = new SendMessageUseCase(
      patientRepository,
      schedulingRepository,
      sendAndSaveNotificationUseCase,
    );
  });

  it("Deve chamar patientRepository.getById e buscar os dados do paciente", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      messageCampaign: {
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

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      messageCampaign: {
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
      },
    ]);

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      schedulingId: "scheduling-id",
      messageCampaign: {
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá, seja muito bem vindo a clinica",
      },
    });

    expect(schedulingRepository.get).toBeCalledTimes(1);
    expect(schedulingRepository.get).toBeCalledWith({
      userId: "user-id",
      id: "scheduling-id",
    });
  });

  it("Deve chamar o metodo saveAndSendNotificationUseCase.execute com os dados corretos", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        patient: "Nome Paciente",
        phone: "(51) 90000 9000",
        id: "scheduling-id",
        patientId: "patient-id",
      },
    ]);

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      schedulingId: "scheduling-id",
      messageCampaign: {
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage: "Olá, seja muito bem vindo a clinica",
      },
    });

    expect(sendAndSaveNotificationUseCase.execute).toBeCalledTimes(1);
    expect(sendAndSaveNotificationUseCase.execute).toHaveBeenCalledWith({
      notification: expect.any(NotificationSendMessage),
      userId: "user-id",
    });
  });

  it("Deve substituir corretamente as variáveis do templateMessage ao enviar a notificação", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);

    schedulingRepository.get.mockResolvedValue([
      {
        patient: "Nome Paciente",
        phone: "(51) 90000 9000",
        id: "scheduling-id",
        patientId: "patient-id",
      },
    ]);

    await sendMessageUseCase.execute({
      userId: "user-id",
      patientId: "patient-id",
      schedulingId: "scheduling-id",
      messageCampaign: {
        active: true,
        name: "Boas vindas",
        triggers: [{ event: "createPatient" }],
        templateMessage:
          "Olá {{nome_paciente}}, seja muito bem vindo a clinica. Seu telefone é {{telefone_paciente}} e seu genêro é {{genero_paciente}}",
      },
    });

    expect(sendAndSaveNotificationUseCase.execute).toBeCalledTimes(1);
    expect(sendAndSaveNotificationUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        notification: expect.objectContaining({
          params: expect.objectContaining({
            templateMessage:
              "Olá Nome Paciente, seja muito bem vindo a clinica. Seu telefone é (51) 90000 9000 e seu genêro é ",
          }),
        }),
        userId: "user-id",
      }),
    );
  });

  it("Deve evitar que erros ao enviar mensagem se propaguem", async () => {
    patientRepository.getById.mockResolvedValue([
      { name: "Nome Paciente", phone: "(51) 90000 9000", id: "patient-id" },
    ]);
    const errorMessage = "Erro de teste";

    schedulingRepository.get.mockRejectedValue(new Error(errorMessage));

    await expect(
      sendMessageUseCase.execute({
        userId: "user-id",
        patientId: "patient-id",
        schedulingId: "scheduling-id",
        messageCampaign: {
          active: true,
          name: "Boas vindas",
          triggers: [{ event: "createPatient" }],
          templateMessage: "Olá, seja muito bem vindo a clinica.",
        },
      }),
    ).resolves.not.toThrowError();
  });
});
