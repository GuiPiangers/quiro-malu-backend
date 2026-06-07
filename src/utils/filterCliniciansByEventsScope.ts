import type { ClinicianPublicDTO } from '../core/clinician/clinicianPublicDto'
import type { ResolvedPermission } from '../types/permissions'
import { normalizePermissionScope } from './eventsPermissionScope'

export function filterCliniciansByEventsReadScope(data: {
  clinicians: ClinicianPublicDTO[]
  requestUserId: string
  permissions: ResolvedPermission[]
}): ClinicianPublicDTO[] {
  const eventsRead = data.permissions.find(
    (permission) => permission.key === 'events:read',
  )

  if (!eventsRead) return data.clinicians

  const scope = normalizePermissionScope(eventsRead.scope)

  if (scope.type === 'all') return data.clinicians
  if (scope.type === 'own') {
    return data.clinicians.filter(
      (clinician) => clinician.id === data.requestUserId,
    )
  }

  return data.clinicians.filter((clinician) =>
    scope.userIds.includes(clinician.id),
  )
}
