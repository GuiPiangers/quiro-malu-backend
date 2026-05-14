import { Anamnesis, AnamnesisDTO } from "../../../models/Anamnesis";
import { IAnamnesisRepository } from "../../../../../repositories/anamnesis/IAnamnesisRepository";

export class SetAnamnesisUseCase {
  constructor(private anamnesisRepository: IAnamnesisRepository) {}
  async execute(data: AnamnesisDTO, clinicId: string) {
    const anamnesis = new Anamnesis(data);
    const anamnesisAlreadyExist = (
      await this.anamnesisRepository.get(data.patientId, clinicId)
    ).patientId;

    if (anamnesisAlreadyExist) {
      await this.anamnesisRepository.update(data, clinicId);
    } else {
      await this.anamnesisRepository.save(data, clinicId);
    }
    return anamnesis;
  }
}
