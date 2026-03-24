import { MessageLogDTO } from "../../core/messageCampaign/models/MessageLog";

export interface IMessageLogRepository {
  save(log: MessageLogDTO): Promise<void>;
  saveMany(logs: MessageLogDTO[]): Promise<void>;

  getByPatient(
    patientId: string,
    config: { limit: number; offSet: number },
  ): Promise<MessageLogDTO[]>;

  getByCampaign(campaignId: string): Promise<MessageLogDTO[]>;

  countByCampaign(campaignId: string): Promise<{ sent: number; failed: number }>;

  existsBySchedulingAndCampaign(
    schedulingId: string,
    campaignId: string,
  ): Promise<boolean>;
}
