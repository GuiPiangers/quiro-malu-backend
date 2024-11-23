import { ApiError } from "../../utils/ApiError";
import { Crypto } from "./helpers/Crypto";

export class Password {
  constructor(readonly value: string) {
    if (value.length < 5)
      throw new ApiError(
        "A senha deve conter pelo menos 5 caracteres",
        400,
        "password",
      );

    if (!value.match(/[A-Z]/))
      throw new ApiError(
        "A senha deve conter pelo menos uma letra maiúscula",
        400,
        "password",
      );

    if (!value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/))
      throw new ApiError(
        "A senha deve conter pelo menos um número ou carácter especial",
        400,
        "password",
      );
  }

  async getHash() {
    const hash = await Crypto.createRandomHash(this.value);
    return hash;
  }
}
