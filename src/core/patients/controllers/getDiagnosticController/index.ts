import { GetDiagnosticUseCase } from "../../useCases/diagnostic/getDiagnostic/GetDiagnosticUseCase";
import { GetDiagnosticController } from "./GetDiagnosticController";
import { knexDiagnosticRepository } from "../../../../repositories/diagnostic/knexInstances";

const DiagnosticRepository = knexDiagnosticRepository
const getDiagnosticUseCase = new GetDiagnosticUseCase(DiagnosticRepository)
const getDiagnosticController = new GetDiagnosticController(getDiagnosticUseCase)

export { getDiagnosticController }