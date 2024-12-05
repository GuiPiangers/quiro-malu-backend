import { KnexDiagnosticRepository } from "../../../../repositories/diagnostic/KnexDiagnosticRepository";
import { GetDiagnosticUseCase } from "../../useCases/diagnostic/getDiagnostic/GetDiagnosticUseCase";
import { GetDiagnosticController } from "./GetDiagnosticController";

const DiagnosticRepository = new KnexDiagnosticRepository()
const getDiagnosticUseCase = new GetDiagnosticUseCase(DiagnosticRepository)
const getDiagnosticController = new GetDiagnosticController(getDiagnosticUseCase)

export { getDiagnosticController }