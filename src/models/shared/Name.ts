export class Name {
  constructor(
    readonly value: string,
    readonly min: number = 3,
    readonly max: number = 120,
  ) {
    if (!value) throw new Error("O nome é obrigatório");
    if (min > max)
      throw new Error("valor mínimo não pode ser maior que o valor máximo");
    if (value.length < min)
      throw new Error(`O nome deve ter no mínimo ${min} caracteres`);
    if (value.length > max)
      throw new Error(`O nome deve ter no máximo ${max} caracteres`);
    const secondName = value.split(" ")[1];
    if (!secondName)
      throw new Error(`Deve ser informado o nome completo (nome e sobrenome)`);

    this.value = this.capitaliseName(value);
  }

  get firstName() {
    const [firstName] = this.value.split(" ");
    return firstName;
  }

  private capitaliseName(name: string) {
    const nameLowerCase = name.toLowerCase();
    const nameSplited = nameLowerCase.split(" ");

    const nameCapitalized = nameSplited.reduce((prev, word) => {
      const lastLetter = word.charAt(word.length - 1);
      if (word.length <= 2 && lastLetter !== ".") return `${prev} ${word}`;

      const firstLetterUpperCase = word.charAt(0).toUpperCase();
      const wordWithoutFirstLetter = word.slice(1);
      const capitalizedWord = firstLetterUpperCase + wordWithoutFirstLetter;

      return `${prev} ${capitalizedWord}`;
    }, "");

    return nameCapitalized;
  }
}
