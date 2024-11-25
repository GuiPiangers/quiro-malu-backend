import { Response } from "express";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { Patient, PatientDTO } from "../../models/Patient";

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
    const test = new CsvStream<PatientDTO>(buffer, {
      onError(err) {
        response.end(JSON.stringify(err.message));
      },
    });

    console.time();

    const concurrencyLimit = 10; // Define o limite de concorrência
    let activeTasks = 0;
    let savedPatients = 0;
    let errosOnSave = 0;

    const taskQueue: (() => Promise<void>)[] = [];

    const processQueue = async () => {
      while (taskQueue.length > 0 && activeTasks < concurrencyLimit) {
        const task = taskQueue.shift();
        if (task) {
          activeTasks++;
          await task().finally(() => {
            activeTasks--;
            processQueue();
          });
        }
      }
    };

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
            // throw new ApiError(
            //   "Já existe um paciente cadastrado com esses dados",
            // );
          }

          const { location, ...patientDto } = patient.getPatientDTO();
          return patientDto;
        } catch (error: any) {
          return {
            error: error.message,
            patient: {
              ...chunk,
            },
          };
        }
      })
      .transform((chunk) => {
        // Adiciona tarefas à fila com limite de concorrência
        if (this.isPatientData(chunk)) {
          return new Promise<void>((resolve) => {
            const task = async () => {
              try {
                await this.patientRepository.save(chunk, userId);
                savedPatients += 1;
              } catch (error: any) {
                errosOnSave += 1;
              } finally {
                resolve();
              }
            };
            taskQueue.push(task);
            processQueue();
          });
        } else {
          errosOnSave += 1;
          return undefined;
        }
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
