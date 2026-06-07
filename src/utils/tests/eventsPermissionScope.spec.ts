import { describe, expect, it } from 'vitest'
import {
  assertUserIdAllowedInEventsScope,
  isUserIdAllowedInEventsScope,
  normalizePermissionScope,
} from '../eventsPermissionScope'
import { ApiError } from '../ApiError'

describe('eventsPermissionScope', () => {
  it('normalizes null scope to all', () => {
    expect(normalizePermissionScope(null)).toEqual({ type: 'all' })
  })

  it('allows any target when scope is all', () => {
    expect(
      isUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'other',
        scope: { type: 'all' },
      }),
    ).toBe(true)
  })

  it('restricts own scope to request user', () => {
    expect(
      isUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'me',
        scope: { type: 'own' },
      }),
    ).toBe(true)
    expect(
      isUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'other',
        scope: { type: 'own' },
      }),
    ).toBe(false)
  })

  it('restricts list scope to listed user ids', () => {
    expect(
      isUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'b',
        scope: { type: 'list', userIds: ['a', 'b'] },
      }),
    ).toBe(true)
    expect(
      isUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'c',
        scope: { type: 'list', userIds: ['a', 'b'] },
      }),
    ).toBe(false)
  })

  it('throws ApiError when access is denied', () => {
    expect(() =>
      assertUserIdAllowedInEventsScope({
        requestUserId: 'me',
        targetUserId: 'other',
        scope: { type: 'own' },
      }),
    ).toThrow(ApiError)
  })
})
