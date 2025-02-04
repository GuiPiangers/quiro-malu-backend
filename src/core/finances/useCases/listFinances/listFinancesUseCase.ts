import {
  IFinanceRepository,
  listFinanceProps,
} from "../../../../repositories/finance/IFinanceRepository";
import { ApiError } from "../../../../utils/ApiError";

export class ListFinancesUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ userId, yearAndMonth, config }: listFinanceProps) {
    this.validateYearAndMonth(yearAndMonth);

    return await this.financeRepository.list({
      userId,
      yearAndMonth,
      config,
    });
  }

  private validateYearAndMonth(yearAndMonth: string) {
    const vaidTemplate = /^\d{4}-\d{2}$/;
    if (!vaidTemplate.test(yearAndMonth)) {
      throw new ApiError(
        "Formato de yearAndMonth inválido. O formato deve ser YYYY-MM",
        400,
      );
    }
  }
}
