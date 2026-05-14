import { Clinic, ClinicDTO } from "../../models/Clinic";
import { IClinicRepository } from "../../../../repositories/clinic/IClinicRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreateClinicUseCase {
  constructor(private clinicRepository: IClinicRepository) {}

  async execute(data: ClinicDTO): Promise<ClinicDTO> {
    const clinicAlreadyExists = await this.clinicRepository.findByName(
      data.name,
    );
    if (clinicAlreadyExists) {
      throw new ApiError("Clínica já cadastrada", 400, "clinic");
    }

    const clinic = new Clinic(data);
    await this.clinicRepository.save(clinic);

    return clinic.getDTO();
  }
}
