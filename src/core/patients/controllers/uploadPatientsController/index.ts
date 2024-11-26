import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { UploadPatientsController } from "./UploadPatientsController";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { UploadPatientsUseCase } from "../../useCases/uploadPatients/UploadPatientsUseCase";
import { Request, Response } from "express";

const uplaodPatients = {
  handle: (reques: Request, response: Response) => {
    const locationRepository = new KnexLocationRepository();
    const patientRepository = new KnexPatientRepository();
    const uploadPatientsUseCase = new UploadPatientsUseCase(patientRepository);
    const uplaodPatientsController = new UploadPatientsController(
      uploadPatientsUseCase,
    ).handle(reques, response);
    return uplaodPatientsController;
  },
};

export { uplaodPatients as uploadPatientsController };
