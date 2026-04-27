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
  const ip = extractSafeIp(request);
  const components = [
    ip,
    headerToString(request.headers["user-agent"]),
    headerToString(request.headers["accept-language"]),
    headerToString(request.headers["accept-encoding"]),
  ].join("|");

  return createHash("sha256").update(components).digest("hex");
}
