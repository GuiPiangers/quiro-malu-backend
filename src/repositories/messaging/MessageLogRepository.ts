import { MessageLogDTO } from "../../core/messageCampaign/models/MessageLog";
import { MessageLogModel } from "../../database/mongoose/schemas/MessageLogSchema";
import { IMessageLogRepository } from "./IMessageLogRepository";

export class MessageLogRepository implements IMessageLogRepository {
  async save(log: MessageLogDTO): Promise<void> {
    await MessageLogModel.create(log);
  }

  async saveMany(logs: MessageLogDTO[]): Promise<void> {
    if (!logs.length) return;
    await MessageLogModel.insertMany(logs);
  }

  async getByPatient(
    patientId: string,
    config: { limit: number; offSet: number },
  ): Promise<MessageLogDTO[]> {
    const result = await MessageLogModel.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(config.limit)
      .skip(config.offSet);

    return result as unknown as MessageLogDTO[];
  }

  async getByCampaign(campaignId: string): Promise<MessageLogDTO[]> {
    const result = await MessageLogModel.find({ campaignId }).sort({ createdAt: -1 });
    return result as unknown as MessageLogDTO[];
  }

  async countByCampaign(
    campaignId: string,
  ): Promise<{ sent: number; failed: number }> {
    const [sent, failed] = await Promise.all([
      MessageLogModel.countDocuments({ campaignId, status: "SENT" }),
      MessageLogModel.countDocuments({ campaignId, status: "FAILED" }),
    ]);

    return { sent, failed };
  }

  async existsBySchedulingAndCampaign(
    schedulingId: string,
    campaignId: string,
  ): Promise<boolean> {
    const result = await MessageLogModel.exists({ schedulingId, campaignId });
    return Boolean(result);
  }
}
