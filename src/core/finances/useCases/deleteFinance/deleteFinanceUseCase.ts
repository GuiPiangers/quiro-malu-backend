import {
  deleteFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";

export class DeleteFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute(data: deleteFinanceProps) {
    const finance = await this.financeRepository.delete(data);

    return finance;
  }
}
