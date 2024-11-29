import { ApiError } from "../../utils/ApiError";

export class Gender {
  readonly value?: "masculino" | "feminino";

  constructor(gender?: string) {
    const convertedGender = this.convertGender(gender);
    if (this.validateGender(convertedGender)) this.value = convertedGender;
  }

  private validateGender(gender?: string): gender is "masculino" | "feminino" {
    if (gender && gender !== "masculino" && gender !== "feminino") {
      throw new ApiError("O gênero definido é inválido", 400, "gender");
    }
    return true;
  }

  private convertGender(gender?: string) {
    return gender?.toLocaleLowerCase();
  }
}
