import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IMessageLogRepository } from "../../../../repositories/messageCampaign/IMessageLogRepository";
import { PatientDTO } from "../../../patients/models/Patient";
import { SchedulingDTO } from "../../../scheduling/models/Scheduling";
import { DateTime } from "../../../shared/Date";
import {
  MessageCampaign,
  MessageCampaignDTO,
} from "../../models/MessageCampaign";
import { MessageLogDTO, MessageOrigin } from "../../models/MessageLog";

export class SendMessageUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
    private whatsAppProvider: IWhatsAppProvider,
    private messageLogRepository: IMessageLogRepository,
    private instanceName: string,
  ) {}

  async execute({
    userId,
    patientId,
    schedulingId,
    messageCampaign,
    origin,
  }: {
    userId: string;
    patientId: string;
    schedulingId?: string;
    messageCampaign: MessageCampaignDTO;
    origin: MessageOrigin;
  }) {
    const campaignId = messageCampaign.id;

    try {
      const message = new MessageCampaign(messageCampaign);

      if (!campaignId) {
        await this.messageLogRepository.save({
          patientId,
          patientPhone: "",
          campaignId: "",
          origin,
          renderedBody: message.templateMessage,
          status: "FAILED",
          errorMessage: "messageCampaign.id is required",
        });

        return;
      }

      const [patient] = await this.patientRepository.getById(patientId, userId);

      if (!patient?.phone) {
        await this.messageLogRepository.save({
          patientId,
          patientPhone: patient?.phone ?? "",
          campaignId,
          origin,
          schedulingId,
          renderedBody: message.templateMessage,
          status: "FAILED",
          errorMessage: "Patient phone not found",
        });

        return;
      }

      const [scheduling] = schedulingId
        ? await this.schedulingRepository.get({
            id: schedulingId,
            userId,
          })
        : [];

      const renderedBody = this.replaceVariables(message.templateMessage, {
        patient,
        scheduling,
      });

      const sendResult = await this.whatsAppProvider.sendMessage({
        to: this.toInternationalPhone(patient.phone),
        body: renderedBody,
        instanceName: this.instanceName,
      });

      const baseLog: MessageLogDTO = {
        patientId,
        patientPhone: patient.phone,
        campaignId,
        origin,
        schedulingId,
        renderedBody,
        status: sendResult.success ? "SENT" : "FAILED",
        providerMessageId: sendResult.providerMessageId,
        errorMessage: sendResult.errorMessage,
        ...(sendResult.success ? { sentAt: new Date() } : {}),
      };

      await this.messageLogRepository.save(baseLog);
    } catch (error: any) {
      await this.messageLogRepository.save({
        patientId,
        patientPhone: "",
        campaignId: campaignId ?? "",
        origin,
        schedulingId,
        renderedBody: messageCampaign.templateMessage,
        status: "FAILED",
        errorMessage: error?.message ?? "Unexpected error",
      });
    }
  }

  private toInternationalPhone(phone: string) {
    const onlyNumbers = String(phone).replace(/\D/g, "");

    if (onlyNumbers.startsWith("55")) return onlyNumbers;

    return `55${onlyNumbers}`;
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
      nome_paciente: patient.name,
      telefone_paciente: patient.phone,
      genero_paciente: patient.gender ?? "",
      // idade: patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)}` : "",
      data_consulta: scheduling?.date
        ? new DateTime(scheduling?.date).date +
          " às " +
          new DateTime(scheduling?.date).time
        : "",
      servico_consulta: scheduling?.service ?? "",
      status_consulta: scheduling?.status ?? "",
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
