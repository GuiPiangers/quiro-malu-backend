export class Name {
  constructor(
    readonly value: string,
    private config: {
      min?: number,
      max?: number,
      compoundName?: boolean
    } = {}
  ) {
    const { min = 3, max = 120, compoundName = false } = config

    if (!value) throw new Error("O nome é obrigatório");

    if (min > max)
      throw new Error("valor mínimo não pode ser maior que o valor máximo");

    if (value.length < min)
      throw new Error(`Deve ser informado no mínimo ${min} caracteres`);

    if (value.length > max)
      throw new Error(`Deve ser informado no máximo ${max} caracteres`);

    const secondName = value.split(" ")[1];
    if (compoundName && !secondName)
      throw new Error(`Deve ser informado o nome completo (nome e sobrenome)`);

    this.value = this.capitaliseName(value);
  }

  get firstName(): string {
    const firstName = this.value.split(" ");
    return firstName[0];
  }

  private capitaliseName(name: string) {
    const nameLowerCase = name.toLowerCase();
    const nameSplited = nameLowerCase.split(" ");

    const nameCapitalized = nameSplited.map((word) => {
      const lastLetter = word.charAt(word.length - 1);
      if (word.length <= 2 && lastLetter !== ".") return word;

      const firstLetterUpperCase = word.charAt(0).toUpperCase();
      const wordWithoutFirstLetter = word.slice(1);
      const capitalizedWord = firstLetterUpperCase + wordWithoutFirstLetter;

      return capitalizedWord;
    });

    return nameCapitalized.join(' ');
  }
}
