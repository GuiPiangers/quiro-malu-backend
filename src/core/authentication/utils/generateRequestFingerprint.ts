import { createHash } from "crypto";
import { Request } from "express";

function headerToString(value: string | string[] | undefined): string {
  if (value === undefined) {
    return "";
  }
  return Array.isArray(value) ? value.join(",") : value;
}

function extractSafeIp(req: Request): string {
  const ip =
    (req.headers['cf-connecting-ip'] as string) ??
    (req.headers['x-real-ip'] as string)        ??
    req.ip                                       ??
    req.socket?.remoteAddress                    ??
    'unknown';

  return ip.replace('::ffff:', '');
}

export function generateRequestFingerprint(request: Request): string {
  const components = [
    headerToString(request.headers["x-device-id"]),
  ].join("|");

  return headerToString(components);
}
