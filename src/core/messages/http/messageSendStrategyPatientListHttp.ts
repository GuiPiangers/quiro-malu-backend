import { ApiError } from "../../../utils/ApiError";

export type ParseHttpPatientIdListOptions = {
  allowEmpty?: boolean;
};

export function parseHttpPatientIdList(
  raw: unknown,
  options?: ParseHttpPatientIdListOptions,
): string[] {
  if (!Array.isArray(raw)) {
    throw new ApiError("patientIdList deve ser um array", 400, "params.patientIdList");
  }

  const seen = new Set<string>();
  const out: string[] = [];

  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i];
    if (typeof item !== "string") {
      throw new ApiError(
        "cada id em patientIdList deve ser string",
        400,
        "params.patientIdList",
      );
    }
    const id = item.trim();
    if (!id) {
      if (options?.allowEmpty) {
        continue;
      }
      throw new ApiError(
        "cada id em patientIdList deve ser string não vazia",
        400,
        "params.patientIdList",
      );
    }
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }

  if (out.length === 0 && !options?.allowEmpty) {
    throw new ApiError(
      "patientIdList deve conter ao menos um id válido",
      400,
      "params.patientIdList",
    );
  }

  return out;
}
