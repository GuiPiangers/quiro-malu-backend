import {
  IBlockScheduleRepository,
  BlockScheduleDeleteParams,
} from "../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";

export class DeleteBlockScheduleUseCase {
  constructor(private blockScheduleRepository: IBlockScheduleRepository) {}

  async execute(data: BlockScheduleDeleteParams): Promise<void> {
    await this.blockScheduleRepository.delete(data);
  }
}
