import {
  setFinanceProps,
  IFinanceRepository,
} from '../../../../repositories/finance/IFinanceRepository'
import { Finance } from '../../models/Finance'

export class SetFinanceUseCase {
  constructor(private financeRepository: IFinanceRepository) {}

  async execute({ clinicId, ...financeData }: setFinanceProps) {
    const finance = new Finance(financeData)
    const financeDTO = finance.getDTO()

    const financeAlreadyExist = await this.financeRepository.get({
      id: finance.id,
      clinicId,
    })

    if (financeAlreadyExist) {
      return await this.financeRepository.update({
        ...financeDTO,
        id: finance.id,
        clinicId,
      })
    }

    return await this.financeRepository.create({ ...financeDTO, clinicId })
  }
}
