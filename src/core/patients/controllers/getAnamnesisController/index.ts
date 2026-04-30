import { GetAnamnesisUseCase } from "../../useCases/anamesis/getAnamnesis/GetAnamnesisUseCase";
import { GetAnamnesisController } from "./GetAnamnesisController";
import { knexAnamnesisRepository } from "../../../../repositories/anamnesis/knexInstances";

const AnamnesisRepository = knexAnamnesisRepository
const getAnamnesisUseCase = new GetAnamnesisUseCase(AnamnesisRepository)
const getAnamnesisController = new GetAnamnesisController(getAnamnesisUseCase)

export { getAnamnesisController }