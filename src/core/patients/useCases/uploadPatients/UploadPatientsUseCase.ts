import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { LocationDTO } from "../../../shared/Location";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { AnamnesisDTO } from "../../models/Anamnesis";
import { DiagnosticDTO } from "../../models/Diagnostic";
import { Patient, PatientDTO } from "../../models/Patient";

export class UploadPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  private successCounter = 0;
  private erroCounter = 0;
  private duplicateCounter = 0;
  private updateBatch = 10;
  private errorList: { error: string; patient: PatientDTO }[] = [];
  private patientsBatch: (PatientDTO & { userId: string })[] = [];

  async execute({ buffer, userId }: { buffer: Buffer; userId: string }) {
    return await new Promise<{
      fatalError?: string;
      errors: { error: string; patient: PatientDTO }[];
      erroCounter: number;
      successCounter: number;
      duplicateCounter: number;
    }>((resolve) => {
      try {
        const csvStream = new CsvStream<PatientDTO>(buffer, {
          onData() {
            //
          },
        });

        csvStream
          .transform(async (chunk) => {
            try {
              const patient = new Patient(this.removeEmptyFields(chunk));
              if (await this.validatePatientExist(patient, userId)) return;
              await this.validateCpfNotExist({ cpf: patient.cpf, userId });

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
            console.log(
              `${this.successCounter} pacientes salvos e ${this.erroCounter} erros ao salvar pacientes`,
            );
            resolve({
              errors: this.errorList,
              erroCounter: this.erroCounter,
              successCounter: this.successCounter,
              duplicateCounter: this.duplicateCounter,
            });
          });
      } catch (error) {
        resolve({
          fatalError: "Falha ao salvar os pacientes",
          errors: this.errorList,
          erroCounter: this.erroCounter,
          successCounter: this.successCounter,
          duplicateCounter: this.duplicateCounter,
        });
      }
    });
  }

  private getData(
    object: PatientDTO &
      LocationDTO &
      Partial<AnamnesisDTO> &
      Partial<DiagnosticDTO>,
  ) {
    const { name, phone, gender, dateOfBirth, cpf }: PatientDTO = object;
    const { address, cep, city, neighborhood, state }: LocationDTO = object;
    const {
      activities,
      currentIllness,
      familiarHistory,
      history,
      mainProblem,
      medicines,
      smoke,
      surgeries,
      underwentSurgery,
      useMedicine,
    }: Partial<AnamnesisDTO> = object;
    const { diagnostic, treatmentPlan }: Partial<DiagnosticDTO> = object;
    return {
      patientData: { name, phone, gender, dateOfBirth, cpf },
      locationData: { address, cep, city, neighborhood, state },
      anamnesis: {
        activities,
        currentIllness,
        familiarHistory,
        history,
        mainProblem,
        medicines,
        smoke,
        surgeries,
        underwentSurgery,
        useMedicine,
      },
      diagnostic: { diagnostic, treatmentPlan },
    };
  }

  private addError(error: { error: string; patient: PatientDTO }) {
    const maxErrors = 1000;
    this.erroCounter++;
    if (this.errorList.length < maxErrors) {
      this.errorList.push(error);
    }
  }

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

  private async validatePatientExist(patient: Patient, userId: string) {
    const patientExists = await this.patientRepository.getByHash(
      patient.hashData,
      userId,
    );

    if (patientExists?.hashData) {
      this.duplicateCounter++;
      return true;
    }
    return false;
  }

  private async validateCpfNotExist({
    cpf,
    userId,
  }: {
    cpf?: string;
    userId: string;
  }) {
    if (cpf) {
      const [verifyCpf] = await this.patientRepository.getByCpf(cpf, userId);
      if (verifyCpf?.cpf === cpf)
        throw new Error("Já existe um usuário cadastrado com esse CPF");
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
}
