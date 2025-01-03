import {
  getFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";

export class GetFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute(data: getFinanceProps) {
    const finance = await this.financeRepository.get(data);

    return finance.getDTO();
  }
}
