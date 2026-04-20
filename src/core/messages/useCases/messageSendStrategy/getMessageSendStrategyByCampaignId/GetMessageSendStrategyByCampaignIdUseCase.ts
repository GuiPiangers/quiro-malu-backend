import { IMessageSendStrategyRepository } from "../../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../../utils/ApiError";
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
  ): Promise<ListedMessageSendStrategyDTO> {
    const row =
      await this.messageSendStrategyRepository.findActiveStrategyByUserAndCampaign(
        dto.userId,
        dto.campaignId,
      );

    if (!row) {
      throw new ApiError(
        "Nenhuma estratégia de envio vinculada a esta campanha",
        404,
      );
    }

    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      kind: row.kind,
      params: row.params,
      campaignBindingsCount: row.campaignBindingsCount,
    };
  }
}
