export class Email {
  constructor(readonly value: string) {
    if (!value.includes("@")) throw new Error("email inválido");
    const [, domain] = value.split("@");
    if (domain.length < 3) throw new Error("email inválido");
    if (!domain.includes(".")) throw new Error("email inválido");
  }
}
