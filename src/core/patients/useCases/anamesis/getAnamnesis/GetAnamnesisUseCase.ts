import { IAnamnesisRepository } from "../../../../../repositories/anamnesis/IAnamnesisRepository";

export class GetAnamnesisUseCase {
  constructor(private AnamnesisRepository: IAnamnesisRepository) {}

  async execute(patientId: string, clinicId: string) {
    const anamnesisData = await this.AnamnesisRepository.get(patientId, clinicId);

    return anamnesisData ?? {};
  }
}
