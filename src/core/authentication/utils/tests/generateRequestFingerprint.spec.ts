import { Request } from "express";
import { generateRequestFingerprint } from "../generateRequestFingerprint";

function buildRequest(partial: Partial<Request>): Request {
  return partial as Request;
}

describe("generateRequestFingerprint", () => {
  it("deve gerar o mesmo hash para os mesmos componentes", () => {
    const req = buildRequest({
      ip: "203.0.113.1",
      socket: { remoteAddress: "203.0.113.1" } as any,
      headers: {
        "user-agent": "Mozilla/5.0",
        "accept-language": "pt-BR",
        "accept-encoding": "gzip",
      },
    });
    const a = generateRequestFingerprint(req);
    const b = generateRequestFingerprint(req);
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("deve gerar hash diferente quando o IP muda", () => {
    const baseHeaders = {
      "user-agent": "UA",
      "accept-language": "pt",
      "accept-encoding": "gzip",
    };
    const fp1 = generateRequestFingerprint(
      buildRequest({ ip: "10.0.0.1", headers: baseHeaders }),
    );
    const fp2 = generateRequestFingerprint(
      buildRequest({ ip: "10.0.0.2", headers: baseHeaders }),
    );
    expect(fp1).not.toBe(fp2);
  });
});
