import { Response } from "express";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { Patient, PatientDTO } from "../../models/Patient";
import { ApiError } from "../../../../utils/ApiError";

export class UploadPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  private savedPatients = 0;
  private errosOnSave = 0;
  private updateBatch = 3;

  private patientsBatch: (PatientDTO & { userId: string })[] = [];

  private async addPatientToBatch(patientDTO: PatientDTO & { userId: string }) {
    if (
      this.patientsBatch.some(
        (patient) => patient.hashData === patientDTO.hashData,
      )
    ) {
      throw new ApiError("Já existe um paciente cadastrado com esses dados");
    }

    this.patientsBatch.push(patientDTO);

    if (this.patientsBatch.length >= this.updateBatch) {
      return await this.savePatientsBatch();
    }
  }

  private async savePatientsBatch() {
    try {
      await this.patientRepository.saveMany(this.patientsBatch);
      this.savedPatients += this.patientsBatch.length;

      return [...this.patientsBatch];
    } catch (error: any) {
      this.errosOnSave += this.patientsBatch.length;

      return this.patientsBatch.map((patient) => ({
        error: error.message,
        patient,
      }));
    } finally {
      this.patientsBatch = [];
    }
  }

  private removeEmpytyFields(object: PatientDTO) {
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
    response.setHeader("Content-Type", "application/json");

    response.write(`{"data":[`);

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
          const patient = new Patient(this.removeEmpytyFields(chunk));
          const patientExists = await this.patientRepository.getByHash(
            patient.hashData,
            userId,
          );

          if (patientExists?.hashData) {
            throw new ApiError(
              "Já existe um paciente cadastrado com esses dados",
            );
          }

          const { location, ...patientDto } = patient.getPatientDTO();
          const results = await this.addPatientToBatch({
            ...patientDto,
            userId,
          });
          if (results) {
            results.forEach((result) => {
              response.write(`${JSON.stringify(result)},`);
            });
          }

          return JSON.stringify({ ...patientDto, userId });
        } catch (error: any) {
          this.errosOnSave += 1;

          const result = JSON.stringify({
            error: error.message,
            patient: {
              ...chunk,
            },
          });

          response.write(`${result},`);
          return result;
        }
      })
      .stream.on("end", async () => {
        try {
          if (this.patientsBatch.length > 0) {
            await this.savePatientsBatch();
          }
        } catch (error: any) {
          console.log(error.message);

          this.patientsBatch.forEach((patient) => {
            response.write(
              `${JSON.stringify({ error: error.message, patient })},`,
            );
          });

          this.errosOnSave += this.patientsBatch.length;
        }
        console.timeEnd();
        console.log(
          `${this.savedPatients} pacientes salvos e ${this.errosOnSave} erros ao salvar pacientes`,
        );
        response.write("{}],");
        response.write(
          `"summary": {"success": ${this.savedPatients}, "errors": ${this.errosOnSave}}}`,
        );
        response.end();
      });
  }
}
