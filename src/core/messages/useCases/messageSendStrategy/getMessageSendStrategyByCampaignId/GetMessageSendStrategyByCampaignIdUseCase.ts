import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { toMessageSendStrategyDTO } from "../../../sendStrategy/messageSendStrategyKindTypeMaps";
import type { ListedMessageSendStrategyDTO } from "../listMessageSendStrategy/ListMessageSendStrategyUseCase";

export type GetMessageSendStrategyByCampaignIdDTO = {
  userId: string;
  campaignId: string;
};

export class GetMessageSendStrategyByCampaignIdUseCase {
  constructor(
    private readonly messageSendStrategyRepository: IMessageSendStrategyRepository,
  ) {}

  async execute(
    dto: GetMessageSendStrategyByCampaignIdDTO,
  ): Promise<ListedMessageSendStrategyDTO[]> {
    const rows =
      await this.messageSendStrategyRepository.findActiveStrategiesByUserAndCampaign(
        dto.userId,
        dto.campaignId,
      );

    if (rows.length === 0) {
      throw new ApiError(
        "Nenhuma estratégia de envio vinculada a esta campanha",
        404,
      );
    }

    return rows.map((row) => toMessageSendStrategyDTO(row));
  }
}
