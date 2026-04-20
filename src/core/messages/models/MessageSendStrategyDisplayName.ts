import { ApiError } from "../../../utils/ApiError";

export class MessageSendStrategyDisplayName {
  static readonly MAX_LENGTH = 255;

  readonly value: string;

  constructor(raw: string) {
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    if (!trimmed) {
      throw new ApiError("name é obrigatório", 400, "name");
    }
    if (trimmed.length > MessageSendStrategyDisplayName.MAX_LENGTH) {
      throw new ApiError(
        `name deve ter no máximo ${MessageSendStrategyDisplayName.MAX_LENGTH} caracteres`,
        400,
        "name",
      );
    }
    this.value = trimmed;
  }
}
