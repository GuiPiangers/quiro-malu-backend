import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import { Role, RolePermissionDTO } from '../../models/Role'

export class CreateDefaultRolesUseCase {
  constructor(private rbacRepository: IRbacRepository) {}

  async execute({ clinicId }: { clinicId: string }): Promise<void> {
    const clinicianPermissions: RolePermissionDTO[] = [
      { permissionKey: 'patients:read', scope: { type: 'all' } },
      { permissionKey: 'patients:write', scope: { type: 'all' } },
      { permissionKey: 'patients_clinical_data:read', scope: { type: 'all' } },
      { permissionKey: 'patients_clinical_data:write', scope: { type: 'all' } },
      { permissionKey: 'events:read', scope: { type: 'own' } },
      { permissionKey: 'events:write', scope: { type: 'own' } },
      { permissionKey: 'services:read', scope: { type: 'own' } },
      { permissionKey: 'services:write', scope: { type: 'own' } },
    ]
    const clinicianRole = new Role({
      name: 'Clinico',
      description: 'Acesso aos agendamentos e ficha dos pacientes',
      clinicId,
      isSystem: true,
      permissions: clinicianPermissions,
    })

    const attendantPermissions: RolePermissionDTO[] = [
      { permissionKey: 'patients:read', scope: { type: 'all' } },
      { permissionKey: 'patients:write', scope: { type: 'all' } },
      { permissionKey: 'events:read', scope: { type: 'all' } },
      { permissionKey: 'events:write', scope: { type: 'all' } },
      { permissionKey: 'services:read', scope: { type: 'all' } },
    ]
    const attendantRole = new Role({
      name: 'Recepcionista',
      description: 'Acesso aos agendamentos e dados de cadastro dos pacientes',
      clinicId,
      isSystem: true,
      permissions: attendantPermissions,
    })

    const financialPermissions: RolePermissionDTO[] = [
      { permissionKey: 'finance:read', scope: { type: 'all' } },
      { permissionKey: 'finance:write', scope: { type: 'all' } },
    ]
    const financialRole = new Role({
      name: 'Financeiro',
      description: 'Acesso ao financeiro da clínica',
      clinicId,
      isSystem: true,
      permissions: financialPermissions,
    })

    await Promise.all([
      this.rbacRepository.createRole(clinicianRole),
      this.rbacRepository.createRole(attendantRole),
      this.rbacRepository.createRole(financialRole),
    ])
  }
}
