import { Response } from "express";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { Patient, PatientDTO } from "../../models/Patient";
import { ApiError } from "../../../../utils/ApiError";

export class UploadPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  private isPatientData(
    patientData: PatientDTO | { error: string },
  ): patientData is PatientDTO & { userId: string } {
    return (patientData as PatientDTO).name !== undefined;
  }

  private patientsUploadList: (PatientDTO & { userId: string })[] = [];

  private addPatientUpload(patientDTO: PatientDTO & { userId: string }) {
    if (
      this.patientsUploadList.some(
        (patient) => patient.hashData === patientDTO.hashData,
      )
    ) {
      throw new ApiError("Já existe um paciente cadastrado com esses dados");
    }

    this.patientsUploadList.push(patientDTO);
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
    const test = new CsvStream<PatientDTO>(buffer, {
      onError(err) {
        response.end(JSON.stringify(err.message));
      },
    });
    console.time();
    let savedPatients = 0;
    let errosOnSave = 0;
    const updateBatch = 1;
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
        try {
          if (this.isPatientData(chunk)) {
            this.addPatientUpload(chunk);
            if (this.patientsUploadList.length >= updateBatch) {
              await this.patientRepository.saveMany(this.patientsUploadList);
              savedPatients += this.patientsUploadList.length;
              this.patientsUploadList = [];
            }
          } else {
            errosOnSave += 1;
          }
          return JSON.stringify(chunk);
        } catch (error: any) {
          errosOnSave += this.patientsUploadList.length;
          console.log("chegou aqui");
          return JSON.stringify(
            this.patientsUploadList.map((patient) => ({
              error: error.message,
              patient,
            })),
          );
        }
      })
      .stream.on("end", async () => {
        try {
          if (
            this.patientsUploadList.length > 0 &&
            this.patientsUploadList.length < updateBatch
          ) {
            await this.patientRepository.saveMany(this.patientsUploadList);
            savedPatients += this.patientsUploadList.length;
          }
        } catch (error: any) {
          console.log(error.message);
          errosOnSave += this.patientsUploadList.length;
        }
        console.timeEnd();
        console.log(
          `Upload finalizado com sucesso. ${savedPatients} pacientes salvos e ${errosOnSave} erros ao salvar pacientes`,
        );
      })
      .pipe(response)
      .on("finish", () => {
        console.log(
          `${savedPatients} pacientes salvos e ${errosOnSave} erros ao salvar pacientes`,
        );
        console.timeEnd();
      });
  }
}
