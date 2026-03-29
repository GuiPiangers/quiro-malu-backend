import { IWhatsAppProvider } from "../../../../providers/whatsapp/IWhatsAppProvider";
import { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { IWhatsAppInstanceRepository } from "../../../../repositories/whatsapp/IWhatsAppInstanceRepository";
import { ApiError } from "../../../../utils/ApiError";
import { WhatsAppInstance } from "../../../whatsapp/models/WhatsAppInstance";
import { BeforeScheduleMessage } from "../../models/BeforeScheduleMessage";
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
    private whatsAppInstanceRepository: IWhatsAppInstanceRepository,
  ) {}

  async execute(job: SendBeforeScheduleMessageJob): Promise<void> {
    const config = await this.beforeScheduleMessageRepository.getById({
      id: job.beforeScheduleMessageId,
      userId: job.userId,
    });

    if (!config?.isActive) return;

    const instanceDTO = await this.whatsAppInstanceRepository.getByUserId(
      job.userId,
    );

    if (!instanceDTO) {
      throw new ApiError("WhatsApp não conectado para esta clínica", 422);
    }

    const instance = new WhatsAppInstance(instanceDTO);

    const connectionState = await this.whatsAppProvider.getConnectionState(
      instance.instanceName,
    );

    if (connectionState !== "open") {
      throw new ApiError("WhatsApp não conectado para esta clínica", 422);
    }

    const [patient] = await this.patientRepository.getById(
      job.patientId,
      job.userId,
    );

    if (!patient?.phone) return;

    const [scheduling] = await this.schedulingRepository.get({
      id: job.schedulingId,
      userId: job.userId,
    });

    const beforeScheduleMessage = new BeforeScheduleMessage({
      id: config.id,
      minutesBeforeSchedule: config.minutesBeforeSchedule,
      messageTemplate: new MessageTemplate({ textTemplate: config.textTemplate }),
      isActive: config.isActive,
    });

    const renderedBody = beforeScheduleMessage.render({ patient, scheduling });

    await this.whatsAppProvider.sendMessage({
      to: this.toInternationalPhone(patient.phone),
      body: renderedBody,
      instanceName: instance.instanceName,
    });
  }

  private toInternationalPhone(phone: string) {
    const onlyNumbers = String(phone).replace(/\D/g, "");
    if (onlyNumbers.startsWith("55")) return onlyNumbers;
    return `55${onlyNumbers}`;
  }
}
