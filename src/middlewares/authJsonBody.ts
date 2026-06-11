/* eslint-disable no-restricted-syntax */

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { NextFunction, Request, Response } from 'express'

const AUTH_JSON_PATHS = new Set(['/login', '/register', '/logout', '/clinics'])

/** Expõe a normalização para testes e para reuso interno. */
export function normalizeAuthJsonPayload(raw: string): string {
  const trimmed = raw.trim().replace(/^\uFEFF/, '')
  return trimmed.replace(/\r\n/g, '\n').replace(/\n/g, ' ')
}

function requestPathname(req: IncomingMessage): string {
  const raw = req.url ?? '/'
  const q = raw.indexOf('?')
  return (q === -1
    ? raw
    : raw.slice(0, q)) || '/'
}

function isAuthJsonPost(req: IncomingMessage): boolean {
  if (req.method !== 'POST') return false
  if (!AUTH_JSON_PATHS.has(requestPathname(req))) return false
  const ct = (req.headers['content-type'] ?? '').toLowerCase()
  return ct.includes('application/json')
}

/**
 * Retorna **true** quando o `express.json` deve fazer o parse (rotas que não
 * são POST JSON de auth). POST /login|/register|/logout com JSON são tratados
 * por `parseAuthRoutesJsonBody`.
 */
export function shouldExpressJsonParse(req: IncomingMessage): boolean {
  const ct = (req.headers['content-type'] ?? '').toLowerCase()
  if (!ct.includes('application/json')) return false
  return !isAuthJsonPost(req)
}

/**
 * Remove UTF-8 BOM no buffer antes do `JSON.parse` do express (rotas não-auth).
 */
export function expressJsonVerifyStripUtf8Bom(
  _req: IncomingMessage,
  _res: ServerResponse,
  buf: Buffer,
): void {
  if (
    buf.length >= 3 &&
    buf[0] === 0xef &&
    buf[1] === 0xbb &&
    buf[2] === 0xbf
  ) {
    buf[0] = 0x20
    buf[1] = 0x20
    buf[2] = 0x20
  }
}

/**
 * Lê o corpo JSON de /login, /register e /logout com tolerância a:
 * - BOM UTF-8 no início
 * - quebra de linha literal (U+000A/U+000D) colada dentro de strings (Swagger/cópia), que quebram `JSON.parse`
 *
 * Substitui CR/LF por espaço no texto bruto antes do parse (equivalente a
 * minificar o JSON em uma linha). Não altera sequências `\\n` escapadas.
 */
export function parseAuthRoutesJsonBody(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isAuthJsonPost(req)) {
    next()
    return
  }

  let raw = ''
  req.setEncoding('utf8')
  req.on('data', (chunk: string) => {
    raw += chunk
  })
  req.on('end', () => {
    try {
      const flattened = normalizeAuthJsonPayload(raw)
      req.body = flattened
        ? JSON.parse(flattened)
        : {}
      next()
    } catch (err) {
      next(err)
    }
  })
}
