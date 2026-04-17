export type SaveBirthdayMessageProps = {
  id?: string;
  userId: string;
  name: string;
  textTemplate: string;
  isActive: boolean;
};

export interface IBirthdayMessageRepository {
  save(data: SaveBirthdayMessageProps): Promise<void>;
}
