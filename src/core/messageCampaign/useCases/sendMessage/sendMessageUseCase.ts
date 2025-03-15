import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { NotificationSendMessage } from "../../../notification/models/NotificationSendMessage";
import { sendAndSaveNotificationUseCase } from "../../../notification/useCases/sendAndSaveNotification";
import { PatientDTO } from "../../../patients/models/Patient";
import { SchedulingDTO } from "../../../scheduling/models/Scheduling";
import { calculateAge } from "../../../shared/calculateAge";
import { DateTime } from "../../../shared/Date";
import { Phone } from "../../../shared/Phone";
import {
  MessageCampaign,
  MessageCampaignDTO,
} from "../../models/MessageCampaign";

export class SendMessageUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
  ) {}

  async execute({
    userId,
    patientId,
    schedulingId,
    messageCampaign,
  }: {
    userId: string;
    patientId: string;
    schedulingId?: string;
    messageCampaign: MessageCampaignDTO;
  }) {
    const message = new MessageCampaign(messageCampaign);
    const [patient] = await this.patientRepository.getById(patientId, userId);
    const [scheduling] = schedulingId
      ? await this.schedulingRepository.get({
          id: schedulingId,
          userId,
        })
      : [];

    const notification = new NotificationSendMessage({
      title: `Enviar mensagem para ${patient?.name}`,
      message: `Envie uma mensagem de  de ${message.name} para o paciente ${patient?.name}`,
      params: {
        patientId,
        patientPhone: new Phone(patient.phone),
        templateMessage: this.replaceVariables(message.templateMessage, {
          patient,
          scheduling,
        }),
      },
    });
    sendAndSaveNotificationUseCase.execute({ userId, notification });
  }

  private replaceVariables(
    messageTemplate: string,
    {
      patient,
      scheduling,
    }: {
      patient: PatientDTO;
      scheduling?: SchedulingDTO;
    },
  ) {
    const extractRegex = /(\{\{)|(\}\})/g;

    const variableDictionary: Record<string, string> = {
      nome: patient.name,
      telefone: patient.phone,
      genero: patient.gender ?? "",
      idade: patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)}` : "",
      dataConsulta: scheduling?.date
        ? new DateTime(scheduling?.date).date +
          " às " +
          new DateTime(scheduling?.date).time
        : "",
      servico: scheduling?.service ?? "",
      status: scheduling?.status ?? "",
    };

    const variables = this.extractVariables(messageTemplate);

    const replacedString = variables.reduce((acc, value) => {
      const valueWithoutBraces = value.replace(extractRegex, "");
      const result = acc.replace(
        value,
        variableDictionary[valueWithoutBraces] as string,
      );
      return result;
    }, messageTemplate);

    return replacedString;
  }

  private extractVariables(templateMessage: string) {
    const matchRegex = /\{\{.*?\}\}/g;

    const result = templateMessage.match(matchRegex) ?? [];

    return result;
  }
}
