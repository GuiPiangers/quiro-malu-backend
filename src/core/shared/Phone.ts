import { ApiError } from "../../utils/ApiError";

export class Phone {
  constructor(readonly value: string) {
    const pattern = /^[(][0-9]{2}[)][ ][0-9]{5}[ ][0-9]{4}$/;
    if (!pattern.test(value))
      throw new ApiError("Número de telefone fora do padrão esperado");
  }

  static convertPhone(ponhe: string) {
    const onlyNumbers = ponhe.replace(/\D/g, "");

    if (onlyNumbers.length !== 10 && onlyNumbers.length !== 11) return ponhe;

    const allNumbers =
      onlyNumbers.length === 11
        ? onlyNumbers
        : onlyNumbers.replace(/^(\d{2})(\d+)/, "$19$2");

    const result = allNumbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2 $3");

    return result;
  }
}
