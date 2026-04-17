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

export type GetBirthdayMessageByIdProps = {
  id: string;
  userId: string;
};

export type UpdateBirthdayMessageProps = {
  id: string;
  userId: string;
  name?: string;
  textTemplate?: string;
  isActive?: boolean;
  /** MySQL TIME (ex.: "09:30:00"). */
  sendTime?: string;
};

export type DeleteBirthdayMessageProps = {
  id: string;
  userId: string;
};

export interface IBirthdayMessageRepository {
  save(data: SaveBirthdayMessageProps): Promise<void>;
  findActiveByUserId(userId: string): Promise<BirthdayMessageCampaignDTO | null>;
  getById(data: GetBirthdayMessageByIdProps): Promise<BirthdayMessageCampaignDTO | null>;
  update(data: UpdateBirthdayMessageProps): Promise<void>;
  delete(data: DeleteBirthdayMessageProps): Promise<void>;
  listByUserIdPaged(
    data: ListBirthdayMessagesByUserIdProps,
  ): Promise<ListBirthdayMessagesResult>;
}
