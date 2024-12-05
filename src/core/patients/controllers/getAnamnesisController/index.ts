import { KnexAnamnesisRepository } from "../../../../repositories/anamnesis/KnexAnamnesisRepository";
import { GetAnamnesisUseCase } from "../../useCases/anamesis/getAnamnesis/GetAnamnesisUseCase";
import { GetAnamnesisController } from "./GetAnamnesisController";

const AnamnesisRepository = new KnexAnamnesisRepository()
const getAnamnesisUseCase = new GetAnamnesisUseCase(AnamnesisRepository)
const getAnamnesisController = new GetAnamnesisController(getAnamnesisUseCase)

export { getAnamnesisController }