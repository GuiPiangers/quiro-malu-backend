export type SaveAfterScheduleMessageProps = {
  id?: string;
  userId: string;
  name: string;
  minutesAfterSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type AfterScheduleMessageConfigDTO = {
  id: string;
  userId: string;
  name: string;
  minutesAfterSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type GetAfterScheduleMessageByIdProps = {
  id: string;
  userId: string;
};

export type UpdateAfterScheduleMessageProps = {
  id: string;
  userId: string;
  name?: string;
  minutesAfterSchedule?: number;
  textTemplate?: string;
  isActive?: boolean;
};

export type ListAfterScheduleMessagesByUserIdProps = {
  userId: string;
};

export type DeleteAfterScheduleMessageProps = {
  id: string;
  userId: string;
};

export interface IAfterScheduleMessageRepository {
  save(data: SaveAfterScheduleMessageProps): Promise<void>;
  update(data: UpdateAfterScheduleMessageProps): Promise<void>;

  delete(data: DeleteAfterScheduleMessageProps): Promise<void>;

  listAll(): Promise<AfterScheduleMessageConfigDTO[]>;

  listByUserId(
    data: ListAfterScheduleMessagesByUserIdProps,
  ): Promise<AfterScheduleMessageConfigDTO[]>;

  getById(
    data: GetAfterScheduleMessageByIdProps,
  ): Promise<AfterScheduleMessageConfigDTO | null>;
}
