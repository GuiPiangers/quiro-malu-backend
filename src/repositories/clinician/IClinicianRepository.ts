import { Clinician } from "../../core/clinician/models/Clinician";

export type ClinicianFindByIdParams = {
  id: string;
  clinicId: string;
};

export interface IClinicianRepository {
  findById(params: ClinicianFindByIdParams): Promise<Clinician | null>;
  findByClinic(params: { clinicId: string }): Promise<Clinician[]>;
  save(clinician: Clinician): Promise<void>;
}
