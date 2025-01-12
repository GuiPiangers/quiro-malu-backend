import {
  setFinanceProps,
  IFinanceRepository,
} from "../../../../repositories/finance/IFinanceRepository";
import { Finance } from "../../models/Finance";

export class SetFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, ...financeData }: setFinanceProps) {
    const finance = new Finance(financeData);
    const financeDTO = finance.getDTO();

    const financeAlreadyExist = await this.financeRepository.get({
      id: finance.id,
      userId,
    });

    if (financeAlreadyExist)
      return await this.financeRepository.update({
        ...financeDTO,
        id: finance.id,
        userId,
      });

    return await this.financeRepository.create({ ...financeDTO, userId });
  }
}
