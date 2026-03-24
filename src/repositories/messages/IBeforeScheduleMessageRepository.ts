export type SaveBeforeScheduleMessageProps = {
  id?: string;
  userId: string;
  minutesBeforeSchedule: number;
  textTemplate: string;
};

export interface IBeforeScheduleMessageRepository {
  save(data: SaveBeforeScheduleMessageProps): Promise<void>;
}
