import { Anamnesis, AnamnesisDTO } from "../../models/Anamnesis";
import { IAnamnesisRepository } from "../../../../repositories/anamnesis/IAnamnesisRepository";

export class SetAnamnesisUseCase {
    constructor(private anamnesisRepository: IAnamnesisRepository) { }
    async execute(data: AnamnesisDTO, userId: string) {
        const anamnesis = new Anamnesis(data)
        const [anamnesisAlreadyExist] = await this.anamnesisRepository.get(data.patientId, userId)
        if (anamnesisAlreadyExist) {
            await this.anamnesisRepository.update(data, userId);
        }
        else {
            await this.anamnesisRepository.save(data, userId);
        }
        return anamnesis
    }
}
