import type { IRbacRepository, RolePermissionItem } from '../../../../repositories/rbac/IRbacRepository'
import { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'

export type SetUserAsClinicianInputDTO = {
  userId: string
}

/**
 * Permissões mínimas obrigatórias para o funcionamento da função de clínico.
 *
 * - events:read / events:write com scope `own` — mínimo para agendar consultas
 *   e visualizar sua própria agenda.
 * - patients_clinical_data:read / patients_clinical_data:write — necessário para
 *   realizar e registrar atendimentos clínicos.
 *
 * Essas permissões são gravadas diretamente no usuário (user_permissions) e
 * coexistem com a role atual. O merge de scopes garante que se a role conceder
 * um escopo mais amplo (ex: `all`), ele terá precedência automaticamente.
 */
const CLINICIAN_MINIMUM_PERMISSIONS: RolePermissionItem[] = [
  { permissionKey: 'events:read', scope: { type: 'own' } },
  { permissionKey: 'events:write', scope: { type: 'own' } },
  { permissionKey: 'patients:read', scope: null },
  { permissionKey: 'patients:write', scope: null },
  { permissionKey: 'patients_clinical_data:read', scope: null },
  { permissionKey: 'patients_clinical_data:write', scope: null },
]

export class SetUserAsClinicianUseCase {
  constructor(
    private readonly clinicianRepository: IClinicianRepository,
    private readonly userRepository: IUserRepository,
    private readonly rbacRepository: IRbacRepository,
  ) {}

  async execute(
    data: SetUserAsClinicianInputDTO,
    clinicId: string,
  ): Promise<void> {
    const user = await this.userRepository.getById({
      userId: data.userId,
      clinicId,
    })

    if (!user) {
      throw new ApiError('Usuário não encontrado nesta clínica', 404, 'userId')
    }

    const [existingClinicianId] =
      await this.clinicianRepository.findClinicianIdsInClinic({
        clinicId,
        userIds: [data.userId],
      })

    if (existingClinicianId) {
      throw new ApiError('Usuário já é um profissional clínico')
    }

    await this.clinicianRepository.setAsClinician(data.userId)

    await this.rbacRepository.setUserPermissions({
      userId: data.userId,
      items: CLINICIAN_MINIMUM_PERMISSIONS,
    })
  }
}
