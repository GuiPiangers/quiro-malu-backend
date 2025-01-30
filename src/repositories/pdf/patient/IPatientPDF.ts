import { AnamnesisDTO } from "../../../core/patients/models/Anamnesis";
import { DiagnosticDTO } from "../../../core/patients/models/Diagnostic";
import { GenderType } from "../../../core/shared/Gender";
import { LocationDTO } from "../../../core/shared/Location";

export interface IPdfGenerator {
  generate(
    data: {
      name: string;
      phone?: string;
      dateOfBirth?: string;
      gender?: GenderType;
      cpf?: string;
      location?: LocationDTO;
      education?: string;
      maritalStatus?: string;
      profession?: string;
      anamnesis?: Partial<AnamnesisDTO>;
    } & Partial<DiagnosticDTO>,
  ): Promise<Buffer>;
}
