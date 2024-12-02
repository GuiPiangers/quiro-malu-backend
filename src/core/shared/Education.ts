import { ApiError } from "../../utils/ApiError";
import { Normalize } from "./Normalize";

export type EducationType =
  | "superior completo"
  | "superior incompleto"
  | "medio completo"
  | "medio incompleto"
  | "fundamental completo"
  | "fundamental incompleto";

export class Education {
  readonly value?: EducationType;

  constructor(education?: string) {
    const convertEdeducation = this.convertEducation(education);
    if (this.validateEducation(convertEdeducation))
      this.value = convertEdeducation;
  }

  private validateEducation(education?: string): education is EducationType {
    const educationPossibility = [
      "superior completo",
      "superior incompleto",
      "medio completo",
      "medio incompleto",
      "fundamental completo",
      "fundamental incompleto",
    ];

    if (
      education &&
      educationPossibility.every((possibility) => possibility !== education)
    ) {
      console.log(education);
      throw new ApiError(
        "A escolaridade definida é inválida",
        400,
        "education",
      );
    }
    return true;
  }

  private convertEducation(education?: string) {
    if (!education) return undefined;
    const lowerCaseEducation = education.toLowerCase().trim();
    const finishCorrectly = /completo|incompleto$/;

    const resultWithCompleto = finishCorrectly.test(lowerCaseEducation)
      ? lowerCaseEducation
      : lowerCaseEducation + " completo";

    const result = Normalize.removeAccent(resultWithCompleto).replace(
      /ensino ?/,
      "",
    );

    return result;
  }
}
