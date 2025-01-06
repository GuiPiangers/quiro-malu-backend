import {
  IFinanceRepository,
  listFinanceProps,
} from "../../../../repositories/finance/IFinanceRepository";

export class ListFinancesUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, config }: listFinanceProps) {
    return await this.financeRepository.list({ userId, config });
  }
}
