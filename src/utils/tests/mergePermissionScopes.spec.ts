import { describe, expect, it } from 'vitest'
import { mergeScopesForSamePermission, parsePermissionScope } from '../mergePermissionScopes'

describe('mergePermissionScopes', () => {
  it('treats null as unrestricted and merges to all when combined with all', () => {
    expect(mergeScopesForSamePermission([null, { type: 'own' }])).toEqual({
      type: 'all',
    })
  })

  it('merges list user ids uniquely', () => {
    expect(
      mergeScopesForSamePermission([
        { type: 'list', userIds: ['a', 'b'] },
        { type: 'list', userIds: ['b', 'c'] },
      ]),
    ).toEqual({ type: 'list', userIds: ['a', 'b', 'c'] })
  })

  it('parses JSON string scope', () => {
    expect(parsePermissionScope('{"type":"own"}')).toEqual({ type: 'own' })
  })
})
