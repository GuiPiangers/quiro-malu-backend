import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";

export interface IBlockScheduleRepository {
  save(data: BlockSchedule, userId: string): Promise<void>;
}
