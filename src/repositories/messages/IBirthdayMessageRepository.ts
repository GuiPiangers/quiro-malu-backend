export type SaveBirthdayMessageProps = {
  id?: string;
  userId: string;
  name: string;
  textTemplate: string;
  isActive: boolean;
  /** Horário de envio no dia do aniversário (MySQL TIME, ex.: "09:30:00"). */
  sendTime: string;
};

export type BirthdayMessageCampaignDTO = {
  id: string;
  userId: string;
  name: string;
  textTemplate: string;
  isActive: boolean;
  /** "HH:mm" no fuso usado na campanha (valor persistido). */
  sendTime: string;
};

export type ListBirthdayMessagesByUserIdProps = {
  userId: string;
  limit: number;
  offset: number;
};

export type ListBirthdayMessagesResult = {
  items: BirthdayMessageCampaignDTO[];
  total: number;
};

export interface IBirthdayMessageRepository {
  save(data: SaveBirthdayMessageProps): Promise<void>;
  findActiveByUserId(userId: string): Promise<BirthdayMessageCampaignDTO | null>;
  listByUserIdPaged(
    data: ListBirthdayMessagesByUserIdProps,
  ): Promise<ListBirthdayMessagesResult>;
}
