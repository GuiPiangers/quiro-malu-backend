import { describe, expect, it } from 'vitest'
import { normalizeAuthJsonPayload } from '../authJsonBody'

describe('normalizeAuthJsonPayload', () => {
  it('permite JSON.parse quando há newline literal dentro do valor de password (caso Swagger/cópia)', () => {
    const raw = `{"email":"a@b.com","password":"sec${'\n'}ret"}`
    expect(() => JSON.parse(raw)).toThrow(SyntaxError)
    const fixed = normalizeAuthJsonPayload(raw)
    expect(JSON.parse(fixed)).toEqual({
      email: 'a@b.com',
      password: 'sec ret',
    })
  })

  it('remove BOM Unicode no início', () => {
    const raw = '\uFEFF{"email":"a@b.com","password":"x"}'
    const fixed = normalizeAuthJsonPayload(raw)
    expect(JSON.parse(fixed)).toEqual({ email: 'a@b.com', password: 'x' })
  })
})
