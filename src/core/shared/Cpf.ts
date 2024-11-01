import { ApiError } from "../../utils/ApiError";

export class Cpf {
  constructor(readonly value: string) {
    const pattern = /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/;
    if (!pattern.test(value))
      throw new ApiError("CPF fora do padrão esperado", 400, "cpf");
  }
}
