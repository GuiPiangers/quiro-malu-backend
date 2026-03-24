export type SaveBeforeScheduleMessageProps = {
  id?: string;
  userId: string;
  minutesBeforeSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type BeforeScheduleMessageConfigDTO = {
  id: string;
  userId: string;
  minutesBeforeSchedule: number;
  textTemplate: string;
  isActive: boolean;
};

export type GetBeforeScheduleMessageByIdProps = {
  id: string;
  userId: string;
};

export interface IBeforeScheduleMessageRepository {
  save(data: SaveBeforeScheduleMessageProps): Promise<void>;

  listAll(): Promise<BeforeScheduleMessageConfigDTO[]>;

  getById(
    data: GetBeforeScheduleMessageByIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO | null>;
}
