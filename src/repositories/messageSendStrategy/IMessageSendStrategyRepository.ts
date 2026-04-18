export type MessageSendStrategyRow = {
  id: string;
  userId: string;
  kind: string;
  params: Record<string, unknown>;
};

export type SaveMessageSendStrategyProps = {
  id: string;
  userId: string;
  kind: string;
  params: Record<string, unknown>;
};

export interface IMessageSendStrategyRepository {
  save(data: SaveMessageSendStrategyProps): Promise<void>;
  listByUserId(userId: string): Promise<MessageSendStrategyRow[]>;
  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<MessageSendStrategyRow | null>;
  findActiveStrategyByUserAndCampaign(
    userId: string,
    campaignId: string,
  ): Promise<MessageSendStrategyRow | null>;
  upsertCampaignBinding(
    userId: string,
    campaignId: string,
    strategyId: string,
  ): Promise<void>;
  deleteByIdAndUserId(id: string, userId: string): Promise<void>;
}
