export class Email {
  constructor(readonly value: string) {
    if (!value.includes("@")) throw new Error("email inválido");
    const [, domain] = value.split("@");
    if (!domain.includes(".")) throw new Error("email inválido");
  }
}
