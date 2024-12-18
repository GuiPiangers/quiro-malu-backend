import {
  IFinanceRepository,
  listFinanceProps,
} from "../../../../repositories/finance/IFinanceRepository";

export class ListFinancesUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, congif }: listFinanceProps) {
    return await this.financeRepository.lsit({ userId, congif });
  }
}
