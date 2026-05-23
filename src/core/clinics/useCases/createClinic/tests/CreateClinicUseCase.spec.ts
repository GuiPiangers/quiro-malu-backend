import { createMockClinicRepository } from '../../../../../repositories/_mocks/ClinicRepositoryMock'
import { createMockRbacRepository } from '../../../../../repositories/_mocks/RbacRepositoryMock'
import { ApiError } from '../../../../../utils/ApiError'
import { CreateClinicUseCase } from '../CreateClinicUseCase'

describe('CreateClinicUseCase', () => {
  const clinicRepository = createMockClinicRepository()
  const rbacRepository = createMockRbacRepository()
  let createClinicUseCase: CreateClinicUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    rbacRepository.createClinicAdminRole.mockResolvedValue('role-id')
    createClinicUseCase = new CreateClinicUseCase(
      clinicRepository,
      rbacRepository,
    )
  })

  it('should create clinic', async () => {
    clinicRepository.findByName.mockResolvedValue(null)

    const clinic = await createClinicUseCase.execute({
      name: 'Clínica Teste',
    })

    expect(clinic).toHaveProperty('id')
    expect(clinicRepository.save).toHaveBeenCalledTimes(1)
    expect(rbacRepository.createClinicAdminRole).toHaveBeenCalledTimes(1)
  })

  it('should reject duplicated clinic name', async () => {
    clinicRepository.findByName.mockResolvedValue({
      id: 'clinic-id',
      name: 'Clínica Teste',
      getDTO: () => ({ id: 'clinic-id', name: 'Clínica Teste' }),
    } as any)

    await expect(
      createClinicUseCase.execute({ name: 'Clínica Teste' }),
    ).rejects.toThrow(ApiError)
  })
})
