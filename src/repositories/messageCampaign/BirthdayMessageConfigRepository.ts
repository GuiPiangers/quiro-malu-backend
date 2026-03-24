import { BirthdayMessageConfigDTO } from "../../core/messageCampaign/models/BirthdayMessageConfig";
import { BirthdayMessageConfigModel } from "../../database/mongoose/schemas/BirthdayMessageConfigSchema";
import { IBirthdayMessageConfigRepository } from "./IBirthdayMessageConfigRepository";

export class BirthdayMessageConfigRepository
  implements IBirthdayMessageConfigRepository
{
  private static readonly SINGLETON_ID = "birthday_config";

  async get(): Promise<BirthdayMessageConfigDTO | null> {
    const result = await BirthdayMessageConfigModel.findById(
      BirthdayMessageConfigRepository.SINGLETON_ID,
    );

    return result as unknown as BirthdayMessageConfigDTO | null;
  }

  async save(config: BirthdayMessageConfigDTO): Promise<void> {
    await BirthdayMessageConfigModel.updateOne(
      { _id: BirthdayMessageConfigRepository.SINGLETON_ID },
      { ...config, _id: BirthdayMessageConfigRepository.SINGLETON_ID },
      { upsert: true },
    );
  }
}
