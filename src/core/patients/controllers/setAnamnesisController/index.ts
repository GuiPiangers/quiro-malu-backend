import { KnexAnamnesisRepository } from "../../../../repositories/anamnesis/KnexAnamnesisRepository";
import { SetAnamnesisUseCase } from "../../useCases/anamesis/setAnamnesis/SetAnamnesisUseCase";
import { SetAnamnesisController } from "./SetAnamnesisController";

const anamnesisRepository = new KnexAnamnesisRepository()
const setAnamnesisUseCase = new SetAnamnesisUseCase(anamnesisRepository)
const setAnamnesisController = new SetAnamnesisController(setAnamnesisUseCase)

export { setAnamnesisController }