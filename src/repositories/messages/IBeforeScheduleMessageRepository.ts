export type SaveBeforeScheduleMessageProps = {
  id?: string;
  userId: string;
  name: string;
  minutesBeforeSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type BeforeScheduleMessageConfigDTO = {
  id: string;
  userId: string;
  name: string;
  minutesBeforeSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type GetBeforeScheduleMessageByIdProps = {
  id: string;
  userId: string;
};

export type UpdateBeforeScheduleMessageProps = {
  id: string;
  userId: string;
  name?: string;
  minutesBeforeSchedule?: number;
  textTemplate?: string;
  isActive?: boolean;
};

export type ListBeforeScheduleMessagesByUserIdProps = {
  userId: string;
};

export type DeleteBeforeScheduleMessageProps = {
  id: string;
  userId: string;
};

export interface IBeforeScheduleMessageRepository {
  save(data: SaveBeforeScheduleMessageProps): Promise<void>;
  update(data: UpdateBeforeScheduleMessageProps): Promise<void>;

  delete(data: DeleteBeforeScheduleMessageProps): Promise<void>;

  listAll(): Promise<BeforeScheduleMessageConfigDTO[]>;

  listByUserId(
    data: ListBeforeScheduleMessagesByUserIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO[]>;

  getById(
    data: GetBeforeScheduleMessageByIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO | null>;
}
