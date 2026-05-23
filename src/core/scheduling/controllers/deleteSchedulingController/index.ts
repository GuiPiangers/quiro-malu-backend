import { DeleteSchedulingUseCase } from '../../useCases/deleteScheduling/DeleteSchedulingUseCase'
import { DeleteSchedulingController } from './DeleteSchedulingController'
import { appEventListener } from '../../../shared/observers/EventListener'
import { knexSchedulingRepository } from '../../../../repositories/scheduling/knexInstances'

const schedulingRepository = knexSchedulingRepository
const deleteSchedulingUseCase = new DeleteSchedulingUseCase(
  schedulingRepository,
  appEventListener,
)
const deleteSchedulingController = new DeleteSchedulingController(deleteSchedulingUseCase)

export { deleteSchedulingController }
