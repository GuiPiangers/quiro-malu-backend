import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { NotificationSendMessage } from "../../../notification/models/NotificationSendMessage";
import { sendAndSaveNotificationUseCase } from "../../../notification/useCases/sendAndSaveNotification";
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

    const notification = new NotificationSendMessage({
      title: `Enviar mensagem para ${patient?.name}`,
      message: `Envie uma mensagem de  de ${message.name} para o paciente ${patient?.name}`,
      params: { patientId, patientPhone: new Phone(patient.phone) },
    });
    sendAndSaveNotificationUseCase.execute({ userId, notification });
  }
}
