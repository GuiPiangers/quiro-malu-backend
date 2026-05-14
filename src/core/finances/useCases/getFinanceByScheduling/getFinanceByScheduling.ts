import {
  getBySchedulingFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";

export class GetFinanceBySchedulingUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ schedulingId, clinicId }: getBySchedulingFinanceProps) {
    const finance = await this.financeRepository.getByScheduling({
      schedulingId,
      clinicId,
    });

    return finance;
  }
}
