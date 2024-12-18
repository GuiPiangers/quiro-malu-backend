import {
  createFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";
import { Finance } from "../../models/Finance";

export class createFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, ...financeData }: createFinanceProps) {
    const finance = new Finance(financeData);
    const financeDTO = finance.getDTO();

    return await this.financeRepository.create({ ...financeDTO, userId });
  }
}
