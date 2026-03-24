import { BirthdayMessageConfigDTO } from "../../core/messageCampaign/models/BirthdayMessageConfig";

export interface IBirthdayMessageConfigRepository {
  get(): Promise<BirthdayMessageConfigDTO | null>;
  save(config: BirthdayMessageConfigDTO): Promise<void>; // upsert
}
