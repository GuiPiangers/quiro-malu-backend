import { ApiError } from "../../utils/ApiError";
import { Crypto } from "./helpers/Crypto";

export class Password {
  constructor(readonly value: string) {
    if (value.length < 5)
      throw new ApiError("A senha deve conter pelo menos 5 caracteres");

    if (!value.match(/[A-Z]/))
      throw new ApiError("A senha deve conter pelo menos uma letra maiúscula");

    if (
      !value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/)
    )
      throw new ApiError(
        "A senha deve conter pelo menos um número ou carácter especial",
      );
  }

  async getHash() {
    const hash = await Crypto.createHash(this.value);
    return hash;
  }
}
