import { Anamnesis, AnamnesisDTO } from "../../models/Anamnesis";
import { IAnamnesisRepository } from "../../../../repositories/anamnesis/IAnamnesisRepository";

export class CreateAnamnesisUseCase {
    constructor(private anamnesisRepository: IAnamnesisRepository) { }
    async execute(data: AnamnesisDTO, userId: string) {
        const anamnesis = new Anamnesis(data)
        await this.anamnesisRepository.save(data, userId);
        return anamnesis
    }
}
