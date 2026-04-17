import { IWhatsAppProvider } from "../../../../../providers/whatsapp/IWhatsAppProvider";
import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { IPatientRepository } from "../../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { IWhatsAppInstanceRepository } from "../../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { IWhatsAppMessageLogRepository } from "../../../../../repositories/whatsapp/IWhatsAppMessageLogRepository";
import { IAppEventListener } from "../../../../shared/observers/EventListener";
import { Id } from "../../../../shared/Id";
import { AfterScheduleMessage } from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";
import { getConnectedWhatsAppInstance } from "../../../utils/getConnectedWhatsAppInstance";
import { toInternationalPhone } from "../../../utils/toInternationalPhone";

export type SendAfterScheduleMessageJob = {
  userId: string;
  patientId: string;
  schedulingId: string;
  afterScheduleMessageId: string;
};

export class SendAfterScheduleMessageUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
    private patientRepository: IPatientRepository,
    private schedulingRepository: ISchedulingRepository,
    private whatsAppProvider: IWhatsAppProvider,
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
    private whatsAppMessageLogRepository: IWhatsAppMessageLogRepository,
    private appEventListener: IAppEventListener,
  ) {}

  async execute(job: SendAfterScheduleMessageJob): Promise<void> {
    const config = await this.afterScheduleMessageRepository.getById({
      id: job.afterScheduleMessageId,
      userId: job.userId,
    });

    if (!config?.isActive) return;

    const instance = await getConnectedWhatsAppInstance({
      userId: job.userId,
      whatsAppInstanceRepository: this.whatsAppInstanceRepository,
      whatsAppProvider: this.whatsAppProvider,
    });

    const [patient] = await this.patientRepository.getById(
      job.patientId,
      job.userId,
    );

    if (!patient?.phone) return;

    const [scheduling] = await this.schedulingRepository.get({
      id: job.schedulingId,
      userId: job.userId,
    });

    if (scheduling?.status !== "Atendido") {
      return;
    }

    const afterScheduleMessage = new AfterScheduleMessage({
      id: config.id,
      name: config.name,
      minutesAfterSchedule: config.minutesAfterSchedule,
      messageTemplate: new MessageTemplate({ textTemplate: config.textTemplate }),
      isActive: config.isActive,
    });

    const renderedBody = afterScheduleMessage.render({ patient, scheduling });
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
        schedulingId: job.schedulingId,
        scheduleMessageType: "afterSchedule",
        scheduleMessageConfigId: job.afterScheduleMessageId,
        message: renderedBody,
        toPhone,
        instanceName: instance.instanceName,
        status: "PENDING",
        providerMessageId: sendResult.providerMessageId ?? null,
      });

      this.appEventListener.emit("afterScheduleMessageSend", {
        userId: job.userId,
        patientId: job.patientId,
        schedulingId: job.schedulingId,
        afterScheduleMessageId: job.afterScheduleMessageId,
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
        scheduleMessageType: "afterSchedule",
        scheduleMessageConfigId: job.afterScheduleMessageId,
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
