import { UpdateSchedulingUseCase } from '../../../scheduling/useCases/updateScheduling/UpdateSchedulingUseCase'
import { appEventListener } from '../../../shared/observers/EventListener'
import { blockScheduleRepository } from '../../../../repositories/blockScheduleRepository/knexInstances'
import { knexSchedulingRepository } from '../../../../repositories/scheduling/knexInstances'
import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'

export function updateSchedulingUseCaseFactory() {
  return new UpdateSchedulingUseCase(
    knexSchedulingRepository,
    blockScheduleRepository,
    knexClinicianRepository,
    appEventListener,
  )
}
