import type { ClinicianPublicDTO } from '../../core/clinician/clinicianPublicDto'
import { filterCliniciansByEventsReadScope } from '../filterCliniciansByEventsScope'

const clinicians: ClinicianPublicDTO[] = [
  {
    id: 'user-a',
    name: 'Ana',
    email: 'ana@test.com',
    phone: '1',
    clinicId: 'clinic-1',
    services: [],
  },
  {
    id: 'user-b',
    name: 'Bruno',
    email: 'bruno@test.com',
    phone: '2',
    clinicId: 'clinic-1',
    services: [],
  },
]

describe('filterCliniciansByEventsReadScope', () => {
  it('returns all clinicians when events:read scope is all', () => {
    const result = filterCliniciansByEventsReadScope({
      clinicians,
      requestUserId: 'user-a',
      permissions: [{ key: 'events:read', scope: { type: 'all' } }],
    })

    expect(result).toHaveLength(2)
  })

  it('returns only the request user when scope is own', () => {
    const result = filterCliniciansByEventsReadScope({
      clinicians,
      requestUserId: 'user-a',
      permissions: [{ key: 'events:read', scope: { type: 'own' } }],
    })

    expect(result).toEqual([clinicians[0]])
  })

  it('returns only listed clinicians when scope is list', () => {
    const result = filterCliniciansByEventsReadScope({
      clinicians,
      requestUserId: 'user-a',
      permissions: [
        {
          key: 'events:read',
          scope: { type: 'list', userIds: ['user-b'] },
        },
      ],
    })

    expect(result).toEqual([clinicians[1]])
  })

  it('returns all clinicians when events:read permission is missing', () => {
    const result = filterCliniciansByEventsReadScope({
      clinicians,
      requestUserId: 'user-a',
      permissions: [{ key: 'users:read', scope: null }],
    })

    expect(result).toHaveLength(2)
  })
})

export {}
