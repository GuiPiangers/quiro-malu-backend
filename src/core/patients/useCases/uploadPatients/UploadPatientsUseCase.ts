import { Response } from "express";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { Patient, PatientDTO } from "../../models/Patient";
import { threadId } from "worker_threads";
import { ApiError } from "../../../../utils/ApiError";

export class UploadPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  private isPatientData(
    patientData: PatientDTO | { error: string },
  ): patientData is PatientDTO & { userId: string } {
    return (patientData as PatientDTO).name !== undefined;
  }

  execute({
    buffer,
    userId,
    response,
  }: {
    buffer: Buffer;
    userId: string;
    response: Response;
  }) {
    let patientsUploadList: (PatientDTO & { userId: string })[] = [];
    const test = new CsvStream<PatientDTO>(buffer);
    console.time();
    let savedPatients = 0;
    let errosOnSave = 0;
    const updateBatch = 10;
    test
      .transform((chunk) => {
        const entries = Object.entries(chunk);
        const result = entries
          .filter(([_, value]) => value && value !== "")
          .reduce((acc, [key, value]) => {
            return { ...acc, [key]: value };
          }, {}) as unknown as PatientDTO;
        return result;
      })
      .transform(async (chunk) => {
        try {
          const patient = new Patient(chunk);
          const patientExistis = await this.patientRepository.getByHash(
            patient.hashData,
            userId,
          );

          if (patientExistis?.hashData) {
            throw new ApiError(
              "Já existe um paciente cadastrado com esses dados",
            );
          }

          const { location, ...patientDto } = patient.getPatientDTO();
          return { ...patientDto, userId };
        } catch (error: any) {
          return {
            error: error.message,
            patient: {
              ...chunk,
            },
          };
        }
      })
      .transform(async (chunk) => {
        if (this.isPatientData(chunk)) {
          patientsUploadList.push(chunk);

          if (patientsUploadList.length >= updateBatch) {
            await this.patientRepository.saveMany(patientsUploadList);

            savedPatients += updateBatch;
            patientsUploadList = [];
          }
        } else {
          errosOnSave += 1;
        }

        return JSON.stringify(chunk);
      })
      .stream.on("end", async () => {
        if (patientsUploadList.length > 0) {
          await this.patientRepository.saveMany(patientsUploadList);
          savedPatients += patientsUploadList.length;
        }
        console.timeEnd();
        console.log(
          `Upload finalizado com sucesso. ${savedPatients} pacientes salvos e ${errosOnSave} erros ao salvar pacientes`,
        );
      })
      .pipe(response);
  }
}
