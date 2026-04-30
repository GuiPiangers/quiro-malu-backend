import { SetDiagnosticUseCase } from "../../useCases/diagnostic/setDiagnostic/SetDiagnosticUseCase";
import { SetDiagnosticController } from "./SetDiagnosticController";
import { knexDiagnosticRepository } from "../../../../repositories/diagnostic/knexInstances";

const DiagnosticRepository = knexDiagnosticRepository;
const setDiagnosticUseCase = new SetDiagnosticUseCase(DiagnosticRepository);
const setDiagnosticController = new SetDiagnosticController(
  setDiagnosticUseCase,
);

export { setDiagnosticController };