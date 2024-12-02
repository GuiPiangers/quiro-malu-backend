import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { UploadPatientsController } from "./UploadPatientsController";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { UploadPatientsUseCase } from "../../useCases/uploadPatients/UploadPatientsUseCase";
import { Request, Response } from "express";
import { MySqlAnamnesisRepository } from "../../../../repositories/anamnesis/MySqlAnamnesisRepository";
import { MySqlDiagnosticRepository } from "../../../../repositories/diagnostic/MySqlDiagnosticRepository";

const uploadPatients = {
  handle: (reques: Request, response: Response) => {
    const locationRepository = new KnexLocationRepository();
    const patientRepository = new KnexPatientRepository();
    const anamnesisRepository = new MySqlAnamnesisRepository();
    const diagnosticRepository = new MySqlDiagnosticRepository();
    const uploadPatientsUseCase = new UploadPatientsUseCase(
      patientRepository,
      locationRepository,
      anamnesisRepository,
      diagnosticRepository,
    );
    const uploadPatientsController = new UploadPatientsController(
      uploadPatientsUseCase,
    ).handle(reques, response);
    return uploadPatientsController;
  },
};

export { uploadPatients as uploadPatientsController };
