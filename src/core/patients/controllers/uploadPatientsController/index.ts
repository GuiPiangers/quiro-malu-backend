import { UploadPatientsController } from "./UploadPatientsController";
import { UploadPatientsUseCase } from "../../useCases/uploadPatients/UploadPatientsUseCase";
import { Request, Response } from "express";
import { knexAnamnesisRepository } from "../../../../repositories/anamnesis/knexInstances";
import { knexDiagnosticRepository } from "../../../../repositories/diagnostic/knexInstances";
import { knexLocationRepository } from "../../../../repositories/location/knexInstances";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const uploadPatients = {
  handle: (reques: Request, response: Response) => {
    const locationRepository = knexLocationRepository;
    const patientRepository = knexPatientRepository;
    const anamnesisRepository = knexAnamnesisRepository;
    const diagnosticRepository = knexDiagnosticRepository;
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