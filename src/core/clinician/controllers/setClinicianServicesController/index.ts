import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'
import { knexServiceRepository } from '../../../../repositories/service/knexInstances'
import { SetClinicianServicesController } from './SetClinicianServicesController'
import { SetClinicianServicesUseCase } from '../../useCases/setClinicianServices/SetClinicianServicesUseCase'

const setClinicianServicesUseCase = new SetClinicianServicesUseCase(
  knexClinicianRepository,
  knexServiceRepository,
)

const setClinicianServicesController = new SetClinicianServicesController(
  setClinicianServicesUseCase,
)

export { setClinicianServicesController }
