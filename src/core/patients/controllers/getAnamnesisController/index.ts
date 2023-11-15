import { MySqlAnamnesisRepository } from "../../../../repositories/anamnesis/MySqlAnamnesisRepository";
import { GetAnamnesisUseCase } from "../../useCases/getAnamnesis/GetAnamnesisUseCase";
import { GetAnamnesisController } from "./GetAnamnesisController";

const AnamnesisRepository = new MySqlAnamnesisRepository()
const getAnamnesisUseCase = new GetAnamnesisUseCase(AnamnesisRepository)
const getAnamnesisController = new GetAnamnesisController(getAnamnesisUseCase)

export { getAnamnesisController }