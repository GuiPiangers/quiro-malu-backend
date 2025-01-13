import {
  IFinanceRepository,
  listFinanceProps,
} from "../../../../repositories/finance/IFinanceRepository";

export class ListFinancesUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, yearAndMonth, config }: listFinanceProps) {
    return await this.financeRepository.list({
      userId,
      yearAndMonth,
      config,
    });
  }
}
