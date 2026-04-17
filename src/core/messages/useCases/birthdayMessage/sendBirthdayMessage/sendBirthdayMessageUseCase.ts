import { IWhatsAppProvider } from "../../../../../providers/whatsapp/IWhatsAppProvider";
import { IBirthdayMessageRepository } from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { IWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { IWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { IAppEventListener } from "../../../../shared/observers/EventListener";
import { Id } from "../../../../shared/Id";
import { BirthdayMessage } from "../../../models/BirthdayMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";
import { getConnectedWhatsAppInstance } from "../../../utils/getConnectedWhatsAppInstance";
import { toInternationalPhone } from "../../../utils/toInternationalPhone";

export type SendBirthdayMessageJob = {
  userId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientDateOfBirth: string;
  campaignId: string;
  campaignName: string;
  textTemplate: string;
};

const BIRTHDAY_LOG_SCHEDULING_PLACEHOLDER = "";

export class SendBirthdayMessageUseCase {
  constructor(
    private birthdayMessageRepository: IBirthdayMessageRepository,
    private patientRepository: IPatientRepository,
    private whatsAppProvider: IWhatsAppProvider,
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
    private appEventListener: IAppEventListener,
  ) {}

  async execute(job: SendBirthdayMessageJob): Promise<void> {
    const campaign = await this.birthdayMessageRepository.findActiveByUserId(
      job.userId,
    );

    if (!campaign?.isActive || campaign.id !== job.campaignId) {
      return;
    }

    const instance = await getConnectedWhatsAppInstance({
      userId: job.userId,
      whatsAppInstanceRepository: this.whatsAppInstanceRepository,
      whatsAppProvider: this.whatsAppProvider,
    });

    const [patient] = await this.patientRepository.getById(
      job.patientId,
      job.userId,
    );

    if (!patient?.phone?.trim()) {
      return;
    }

    const birthdayMessage = new BirthdayMessage({
      id: campaign.id,
      name: campaign.name,
      sendTime: campaign.sendTime,
      messageTemplate: new MessageTemplate({ textTemplate: campaign.textTemplate }),
      isActive: campaign.isActive,
    });

    const renderedBody = birthdayMessage.render({
      patient: {
        name: patient.name,
        phone: patient.phone,
        birthDate: patient.dateOfBirth ?? job.patientDateOfBirth,
      },
    });

    const toPhone = toInternationalPhone(patient.phone);

    const sendResult = await this.whatsAppProvider.sendMessage({
      to: toPhone,
      body: renderedBody,
      instanceName: instance.instanceName,
    });

    if (sendResult.success) {
      const messageLogId = new Id().value;
      await this.whatsAppMessageLogRepository.save({
        id: messageLogId,
        userId: job.userId,
        patientId: job.patientId,
        schedulingId: BIRTHDAY_LOG_SCHEDULING_PLACEHOLDER,
        scheduleMessageType: "birthday",
        scheduleMessageConfigId: job.campaignId,
        message: renderedBody,
        toPhone,
        instanceName: instance.instanceName,
        status: "PENDING",
        providerMessageId: sendResult.providerMessageId ?? null,
      });

      this.appEventListener.emit("birthdayMessageSend", {
        userId: job.userId,
        patientId: job.patientId,
        birthdayMessageId: job.campaignId,
        instanceName: instance.instanceName,
        toPhone,
        providerMessageId: sendResult.providerMessageId ?? null,
        messageLogId,
      });
    } else {
      await this.whatsAppMessageLogRepository.save({
        id: new Id().value,
        userId: job.userId,
        patientId: job.patientId,
        schedulingId: BIRTHDAY_LOG_SCHEDULING_PLACEHOLDER,
        scheduleMessageType: "birthday",
        scheduleMessageConfigId: job.campaignId,
        message: renderedBody,
        toPhone,
        instanceName: instance.instanceName,
        status: "FAILED",
        providerMessageId: null,
        errorMessage: sendResult.errorMessage ?? "Falha no envio",
      });
    }
  }
}
