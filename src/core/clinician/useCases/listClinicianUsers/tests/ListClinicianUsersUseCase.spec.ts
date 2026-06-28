import { Clinician } from '../../../models/Clinician'
import { createMockClinicianRepository } from '../../../../../repositories/_mocks/ClinicianRepositoryMock'
import { ListClinicianUsersUseCase } from '../ListClinicianUsersUseCase'

describe('ListClinicianUsersUseCase', () => {
  const clinicId = '00000000-0000-4000-8000-000000000001'
  const clinicianRepository = createMockClinicianRepository()
  const useCase = new ListClinicianUsersUseCase(clinicianRepository)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns clinicians without password', async () => {
    const clinician = new Clinician({
      id: 'clinician-1',
      name: 'Dr. Ana',
      email: 'ana@teste.com',
      phone: '(51) 99999 9999',
      password: 'Senha123',
      clinicId,
      roleId: 'role-1',
      services: [{ id: 'svc-1', name: 'Sessão', value: 100, duration: 3600 }],
    })

    clinicianRepository.findByClinic.mockResolvedValue([clinician])

    const { result } = await useCase.execute(clinicId)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 'clinician-1',
      name: 'Dr. Ana',
      email: 'ana@teste.com',
      phone: '(51) 99999 9999',
      clinicId,
      roleId: 'role-1',
      status: 'pending',
      services: [{ id: 'svc-1', name: 'Sessão', value: 100, duration: 3600 }],
    })
    expect(result[0]).not.toHaveProperty('password')
    expect(clinicianRepository.findByClinic).toHaveBeenCalledWith({ clinicId })
  })

  it('returns empty list when clinic has no clinicians', async () => {
    clinicianRepository.findByClinic.mockResolvedValue([])

    const { result } = await useCase.execute(clinicId)

    expect(result).toEqual([])
  })
})

export {}
