import bcrypt from "bcrypt";

export class Password {
  constructor(readonly value: string) {
    if (value.length < 5)
      throw new Error("A senha deve conter pelo menos 5 caracteres");

    if (!value.match(/[A-Z]/))
      throw new Error("A senha deve conter pelo menos uma letra maiúscula");

    if (
      !value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/)
    )
      throw new Error(
        "A senha deve conter pelo menos um número ou carácter especial",
      );
  }

  async getHash() {
    const hash = await bcrypt.hash(this.value, 10);
    return hash;
  }
}
