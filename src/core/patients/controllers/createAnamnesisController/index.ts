import { MySqlAnamnesisRepository } from "../../../../repositories/anamnesis/MySqlAnamnesisRepository";
import { CreateAnamnesisUseCase } from "../../useCases/createAnamnesis/CreateAnamnesisUseCase";
import { CreateAnamnesisController } from "./CreateAnamnesisController";

const anamnesisRepository = new MySqlAnamnesisRepository()
const createAnamnesisUseCase = new CreateAnamnesisUseCase(anamnesisRepository)
const createAnamnesisController = new CreateAnamnesisController(createAnamnesisUseCase)

export { createAnamnesisController }