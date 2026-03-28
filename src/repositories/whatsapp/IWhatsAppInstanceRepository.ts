import { WhatsAppInstanceDTO } from "../../core/whatsapp/models/WhatsAppInstance";

export interface IWhatsAppInstanceRepository {
  save(instance: WhatsAppInstanceDTO): Promise<void>;
  delete(id: string): Promise<void>;
  getByUserId(userId: string): Promise<WhatsAppInstanceDTO | null>;
  getByInstanceName(instanceName: string): Promise<WhatsAppInstanceDTO | null>;
}
