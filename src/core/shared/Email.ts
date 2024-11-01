import { ApiError } from "../../utils/ApiError";

export class Email {
  constructor(readonly value: string) {
    if (!value.includes("@"))
      throw new ApiError("email inválido", 400, "email");
    const [, domain] = value.split("@");
    if (!domain.includes("."))
      throw new ApiError("email inválido", 400, "email");
  }
}
