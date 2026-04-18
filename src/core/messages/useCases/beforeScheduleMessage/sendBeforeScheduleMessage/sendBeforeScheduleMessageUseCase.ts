import { IWhatsAppProvider } from "../../../../../providers/whatsapp/IWhatsAppProvider";
import { IBeforeScheduleMessageRepository } from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { MessageSendStrategyEnforcer } from "../../../sendStrategy/messageSendStrategyEnforcer";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { IWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { IWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { IAppEventListener } from "../../../../shared/observers/EventListener";
import { Id } from "../../../../shared/Id";
import { BeforeScheduleMessage } from "../../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";
import { getConnectedWhatsAppInstance } from "../../../utils/getConnectedWhatsAppInstance";
import { toInternationalPhone } from "../../../utils/toInternationalPhone";

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
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
    private appEventListener: IAppEventListener,
    private messageSendStrategyEnforcer: MessageSendStrategyEnforcer,
  ) {}

  async execute(job: SendBeforeScheduleMessageJob): Promise<void> {
    const messageAlreadySent = await this.whatsAppMessageLogRepository.getBySchedulingAndCampaignId({
      schedulingId: job.schedulingId,
      campaignId: job.beforeScheduleMessageId,
    });

    if (messageAlreadySent) {
      return;
    }
    const [scheduling] = await this.schedulingRepository.get({
      id: job.schedulingId,
      userId: job.userId,
    }) ?? [];

    if (scheduling?.status === "Cancelado" || scheduling?.status === "Atendido") {
      return;
    }

    const config = await this.beforeScheduleMessageRepository.getById({
      id: job.beforeScheduleMessageId,
      userId: job.userId,
    });

    if (!config?.isActive) return;

    const instance = await getConnectedWhatsAppInstance({
      userId: job.userId,
      whatsAppInstanceRepository: this.whatsAppInstanceRepository,
      whatsAppProvider: this.whatsAppProvider,
    });

    const [patient] = await this.patientRepository.getById(
      scheduling.patientId,
      job.userId,
    );

    if (!patient?.phone) return;

    const allowed = await this.messageSendStrategyEnforcer.isSendAllowed(
      job.userId,
      job.beforeScheduleMessageId,
      scheduling.patientId,
    );
    if (!allowed) {
      return;
    }

    const beforeScheduleMessage = new BeforeScheduleMessage({
      id: config.id,
      name: config.name,
      minutesBeforeSchedule: config.minutesBeforeSchedule,
      messageTemplate: new MessageTemplate({ textTemplate: config.textTemplate }),
      isActive: config.isActive,
    });

    const renderedBody = beforeScheduleMessage.render({ patient, scheduling });
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
        patientId: scheduling.patientId,
        schedulingId: job.schedulingId,
        scheduleMessageType: "beforeSchedule",
        scheduleMessageConfigId: job.beforeScheduleMessageId,
        message: renderedBody,
        toPhone,
        instanceName: instance.instanceName,
        status: "PENDING",
        providerMessageId: sendResult.providerMessageId ?? null,
      });

      this.appEventListener.emit("beforeScheduleMessageSend", {
        userId: job.userId,
        patientId: scheduling.patientId,
        schedulingId: job.schedulingId,
        beforeScheduleMessageId: job.beforeScheduleMessageId,
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
        schedulingId: job.schedulingId,
        scheduleMessageType: "beforeSchedule",
        scheduleMessageConfigId: job.beforeScheduleMessageId,
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
