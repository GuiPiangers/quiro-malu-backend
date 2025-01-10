import { IAnamnesisRepository } from "../../../../../repositories/anamnesis/IAnamnesisRepository";

export class GetAnamnesisUseCase {
  constructor(private AnamnesisRepository: IAnamnesisRepository) {}

  async execute(patientId: string, userId: string) {
    const anamnesisData = await this.AnamnesisRepository.get(patientId, userId);

    console.log("use case", anamnesisData);

    return anamnesisData ?? {};
  }
}
