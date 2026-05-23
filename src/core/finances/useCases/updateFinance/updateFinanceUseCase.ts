import {
  updateFinanceProps,
  IFinanceRepository,
} from '../../../../repositories/finance/IFinanceRepository'
import { Finance } from '../../models/Finance'

export class UpdateFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ clinicId, id, ...financeData }: updateFinanceProps) {
    const finance = new Finance({ ...financeData, id })
    const financeDTO = finance.getDTO()

    return await this.financeRepository.update({ ...financeDTO, id, clinicId })
  }
}
