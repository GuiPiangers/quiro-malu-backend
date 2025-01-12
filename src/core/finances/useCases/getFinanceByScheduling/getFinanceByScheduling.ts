import {
  getBySchedulingFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";

export class GetFinanceBySchedulingUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ schedulingId, userId }: getBySchedulingFinanceProps) {
    const finance = await this.financeRepository.getByScheduling({
      schedulingId,
      userId,
    });

    return finance;
  }
}
