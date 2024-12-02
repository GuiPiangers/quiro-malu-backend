import { ApiError } from "../../utils/ApiError";
import { Normalize } from "./Normalize";

export type MaritalStatusType = "casado" | "solteiro" | "viuvo" | "divorciado";

export class MaritalStatus {
  readonly value?: MaritalStatusType;

  constructor(maritalStatus?: string) {
    const convertedMaritalStatus = this.convertMaritalStatus(maritalStatus);
    if (this.validateMaritalStatus(convertedMaritalStatus))
      this.value = convertedMaritalStatus;
  }

  private validateMaritalStatus(
    maritalStatus?: string,
  ): maritalStatus is MaritalStatusType {
    const maritalStatusPossibility = [
      "casado",
      "solteiro",
      "viuvo",
      "divorciado",
    ];

    if (
      maritalStatus &&
      maritalStatusPossibility.every(
        (possibility) => possibility !== maritalStatus,
      )
    ) {
      console.log(maritalStatus);
      throw new ApiError(
        "O estádo cívil definido é inválido",
        400,
        "maritalStatus",
      );
    }
    return true;
  }

  private convertMaritalStatus(maritalStatus?: string) {
    return maritalStatus
      ? Normalize.removeAccent(maritalStatus?.toLocaleLowerCase())
      : maritalStatus;
  }
}
