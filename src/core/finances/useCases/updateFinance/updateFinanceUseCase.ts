import {
  updateFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";
import { Finance } from "../../models/Finance";

export class UpdateFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, ...financeData }: updateFinanceProps) {
    const finance = new Finance(financeData);
    const financeDTO = finance.getDTO();

    return await this.financeRepository.update({ ...financeDTO, userId });
  }
}
