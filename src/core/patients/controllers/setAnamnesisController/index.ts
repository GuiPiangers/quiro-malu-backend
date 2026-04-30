import { SetAnamnesisUseCase } from "../../useCases/anamesis/setAnamnesis/SetAnamnesisUseCase";
import { SetAnamnesisController } from "./SetAnamnesisController";
import { knexAnamnesisRepository } from "../../../../repositories/anamnesis/knexInstances";

const anamnesisRepository = knexAnamnesisRepository
const setAnamnesisUseCase = new SetAnamnesisUseCase(anamnesisRepository)
const setAnamnesisController = new SetAnamnesisController(setAnamnesisUseCase)

export { setAnamnesisController }