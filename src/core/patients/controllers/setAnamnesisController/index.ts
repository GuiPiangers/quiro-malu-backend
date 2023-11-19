import { MySqlAnamnesisRepository } from "../../../../repositories/anamnesis/MySqlAnamnesisRepository";
import { SetAnamnesisUseCase } from "../../useCases/anamesis/setAnamnesis/SetAnamnesisUseCase";
import { SetAnamnesisController } from "./SetAnamnesisController";

const anamnesisRepository = new MySqlAnamnesisRepository()
const setAnamnesisUseCase = new SetAnamnesisUseCase(anamnesisRepository)
const setAnamnesisController = new SetAnamnesisController(setAnamnesisUseCase)

export { setAnamnesisController }