import { Response } from "express";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { Patient, PatientDTO } from "../../models/Patient";

export class UploadPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  private successCounter = 0;
  private erroCounter = 0;
  private duplicateCounter = 0;
  private updateBatch = 10;
  private errorList: { error: string; patient: PatientDTO }[] = [];

  private addError(error: { error: string; patient: PatientDTO }) {
    const maxErrors = 1000;
    this.erroCounter++;
    if (this.errorList.length < maxErrors) {
      this.errorList.push(error);
    }
  }

  private patientsBatch: (PatientDTO & { userId: string })[] = [];

  private async addPatientToBatch(patientDTO: PatientDTO & { userId: string }) {
    if (
      this.patientsBatch.some(
        (patient) => patient.hashData === patientDTO.hashData,
      )
    ) {
      this.duplicateCounter++;
      return;
    }

    this.patientsBatch.push(patientDTO);

    if (this.patientsBatch.length >= this.updateBatch) {
      await this.savePatientsBatch();
    }
  }

  private async savePatientsBatch() {
    try {
      await this.patientRepository.saveMany(this.patientsBatch);
      this.successCounter += this.patientsBatch.length;
    } catch (error: any) {
      this.patientsBatch.forEach((patient) =>
        this.addError({
          error: error.message,
          patient,
        }),
      );
    } finally {
      this.patientsBatch = [];
    }
  }

  private removeEmptyFields(object: PatientDTO) {
    const entries = Object.entries(object);
    const result = entries
      .filter(([_, value]) => value && value !== "")
      .reduce((acc, [key, value]) => {
        return { ...acc, [key]: value };
      }, {}) as unknown as PatientDTO;
    return result;
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
    const csvStream = new CsvStream<PatientDTO>(buffer, {
      onError(err) {
        response.end(JSON.stringify(err.message));
      },
      onData: () => {
        //
      },
    });

    console.time();

    csvStream
      .transform(async (chunk) => {
        try {
          const patient = new Patient(this.removeEmptyFields(chunk));
          const patientExists = await this.patientRepository.getByHash(
            patient.hashData,
            userId,
          );

          if (patientExists?.hashData) {
            this.duplicateCounter++;
            return;
          }

          const { location, ...patientDto } = patient.getPatientDTO();
          await this.addPatientToBatch({
            ...patientDto,
            userId,
          });

          return JSON.stringify({ ...patientDto, userId });
        } catch (error: any) {
          this.addError({
            error: error.message,
            patient: chunk,
          });
        }
      })
      .stream.on("end", async () => {
        try {
          if (this.patientsBatch.length > 0) {
            await this.savePatientsBatch();
          }
        } catch (error: any) {
          this.patientsBatch.forEach((patient) => {
            this.addError({ error: error.message, patient });
          });
        }
        console.timeEnd();
        console.log(
          `${this.successCounter} pacientes salvos e ${this.erroCounter} erros ao salvar pacientes`,
        );
        response.send({
          errors: this.errorList,
          erroCounter: this.erroCounter,
          successCounter: this.successCounter,
          duplicateCounter: this.duplicateCounter,
        });
      });
  }
}
