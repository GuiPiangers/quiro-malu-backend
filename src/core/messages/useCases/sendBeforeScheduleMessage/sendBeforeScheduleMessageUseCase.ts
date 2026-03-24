import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { DateTime } from "../../../shared/Date";
import { MessageTemplate } from "../../models/MessageTemplate";

export type SendBeforeScheduleMessageJob = {
  userId: string;
  patientId: string;
  schedulingId: string;
  beforeScheduleMessageId: string;
};

export class SendBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
    private whatsAppProvider: IWhatsAppProvider,
  ) {}

  async execute(job: SendBeforeScheduleMessageJob): Promise<void> {
    const config = await this.beforeScheduleMessageRepository.getById({
      id: job.beforeScheduleMessageId,
      userId: job.userId,
    });

    if (!config?.isActive) return;

    const [patient] = await this.patientRepository.getById(
      job.patientId,
      job.userId,
    );

    if (!patient?.phone) return;

    const [scheduling] = await this.schedulingRepository.get({
      id: job.schedulingId,
      userId: job.userId,
    });

    const template = new MessageTemplate({ textTemplate: config.textTemplate });
    const renderedBody = template.replaceVariables(
      this.buildTemplateVariables({ patient, scheduling }),
    );

    await this.whatsAppProvider.sendMessage({
      to: this.toInternationalPhone(patient.phone),
      body: renderedBody,
    });
  }

  private toInternationalPhone(phone: string) {
    const onlyNumbers = String(phone).replace(/\D/g, "");
    if (onlyNumbers.startsWith("55")) return onlyNumbers;
    return `55${onlyNumbers}`;
  }

  private buildTemplateVariables({
    patient,
    scheduling,
  }: {
    patient: { name: string; phone: string; gender?: string | undefined };
    scheduling?: { date?: string; service?: string; status?: string };
  }): Record<string, string> {
    const dateTime =
      scheduling?.date != null
        ? new DateTime(scheduling.date).date +
          " às " +
          new DateTime(scheduling.date).time
        : "";

    return {
      nome: patient.name,
      telefone: patient.phone,
      genero: patient.gender ?? "",

      nome_paciente: patient.name,
      telefone_paciente: patient.phone,
      genero_paciente: patient.gender ?? "",

      data_consulta: dateTime,
      servico_consulta: scheduling?.service ?? "",
      status_consulta: scheduling?.status ?? "",
    };
  }
}
