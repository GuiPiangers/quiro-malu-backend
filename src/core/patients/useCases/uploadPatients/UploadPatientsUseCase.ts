/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAnamnesisRepository } from "../../../../repositories/anamnesis/IAnamnesisRepository";
import { IDiagnosticRepository } from "../../../../repositories/diagnostic/IDiagnosticRepository";
import { ILocationRepository } from "../../../../repositories/location/ILocationRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { CsvStream } from "../../../shared/streams/CsvStream";
import { LocationDTO } from "../../../shared/Location";
import { Anamnesis, AnamnesisDTO } from "../../models/Anamnesis";
import { Diagnostic, DiagnosticDTO } from "../../models/Diagnostic";
import { Patient, PatientDTO } from "../../models/Patient";
import { getValidObjectValues } from "../../../../utils/getValidObjectValues";
import { Normalize } from "../../../shared/Normalize";
import { ApiError } from "../../../../utils/ApiError";
import { DateTime } from "../../../shared/Date";
import { Phone } from "../../../shared/Phone";
import { Smoke } from "../../../shared/Smoke";

type CsvPatientObject = PatientDTO &
  LocationDTO &
  Partial<AnamnesisDTO> &
  Partial<DiagnosticDTO>;

export class UploadPatientsUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
    private anamnesisRepository: IAnamnesisRepository,
    private diagnosticRepository: IDiagnosticRepository,
  ) {}

  private successCounter = 0;
  private erroCounter = 0;
  private duplicateCounter = 0;
  private updateBatch = 10;
  private errorList: { error: string; patient: PatientDTO }[] = [];
  private patientsBatch: {
    patientData: PatientDTO & { id: string; userId: string };
    locationData?: LocationDTO;
    anamnesisData?: Partial<AnamnesisDTO>;
    diagnosticData?: Partial<DiagnosticDTO>;
  }[] = [];

  async execute({ buffer, userId }: { buffer: Buffer; userId: string }) {
    const normalizeObject = {
      name: ["nome"],
      phone: ["telefone", "celular"],
      dateOfBirth: ["datadenascimento"],
      gender: ["sexo", "genero"],
      cpf: ["cpf"],
      address: ["endereco"],
      city: ["cidade"],
      state: ["estado"],
      cep: ["cep"],
      neighborhood: ["bairro"],
      diagnostic: ["diagnostico"],
      treatmentPlan: ["planodetratamento"],
      currentIllness: ["doencaatual"],
      activities: ["atividades", "atividadesfisicas"],
      history: ["historico"],
      familiarHistory: ["historicofamiliar"],
      mainProblem: ["problemaprincipal", "principalproblema"],
      smoke: ["fumante"],
      useMedicine: ["usamedicamentos"],
      medicines: ["medicamentos", "medicamentosusados"],
      underwentSurgery: ["realizoucirugias", "tevecirurgias"],
      surgeries: ["cirurgias", "cirurgiasrealizadas"],
      maritalStatus: ["estadocivil"],
      education: ["escolaridade", "formacao", "educacao"],
      profession: ["profissao"],
    };

    const validTableHeaders = Object.values(normalizeObject).reduce(
      (acc, header) => {
        return [...acc, ...header];
      },
      [],
    );

    return await new Promise<{
      fatalError?: string;
      errors: { error: string; patient: PatientDTO }[];
      erroCounter: number;
      successCounter: number;
      duplicateCounter: number;
    }>((resolve, reject) => {
      try {
        const csvStream = new CsvStream<CsvPatientObject>(buffer, {
          onData() {
            //
          },
          onError(error: any) {
            reject(error);
          },
        });

        csvStream
          .transform(async (chunk) => {
            try {
              const chunkHeaders = Object.keys(chunk);
              chunkHeaders.forEach((chunkHeader) => {
                if (
                  !validTableHeaders.some(
                    (validHeader) =>
                      validHeader === Normalize.normalizeString(chunkHeader),
                  )
                ) {
                  csvStream.stream.emit(
                    "error",
                    new ApiError(`O campo "${chunkHeader}" não é válido`, 400),
                  );
                }
              });
              const {
                patientData,
                locationData,
                anamnesisData,
                diagnosticData,
              } = this.getData(
                Normalize.convertObject<CsvPatientObject>(
                  normalizeObject,
                  this.removeEmptyFields(chunk),
                ),
              );
              const patient = new Patient({
                ...patientData,
                location: locationData,
              });

              const { patientId = undefined, ...anamnesisDTO } = anamnesisData
                ? new Anamnesis({
                    ...anamnesisData,
                    patientId: patient.id,
                  })
                : {};

              const { patientId: _ = undefined, ...diagnosticDTO } =
                diagnosticData
                  ? new Diagnostic({
                      ...diagnosticData,
                      patientId: patient.id,
                    })
                  : {};

              if (await this.validatePatientExist(patient, userId)) return;
              await this.validateCpfNotExist({ cpf: patient.cpf, userId });

              const { location, ...patientDto } = patient.getPatientDTO();

              await this.addPatientToBatch({
                patientDTO: {
                  ...patientDto,
                  userId,
                },
                locationDTO: location,
                anamnesisDTO,
                diagnosticDTO,
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
                const { patientData } = patient;
                this.addError({ error: error.message, patient: patientData });
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

  private getData(object: CsvPatientObject) {
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
      patientData: getValidObjectValues({
        name,
        phone: Phone.convertPhone(phone),
        gender,
        dateOfBirth: dateOfBirth ? DateTime.toIsoDate(dateOfBirth) : undefined,
        cpf,
      }),
      locationData: getValidObjectValues({
        address,
        cep,
        city,
        neighborhood,
        state,
      }),
      anamnesisData: getValidObjectValues({
        activities,
        currentIllness,
        familiarHistory,
        history,
        mainProblem,
        medicines,
        smoke: Smoke.convertSmoke(smoke),
        surgeries,
        underwentSurgery: underwentSurgery
          ? this.convertBooleanValue(underwentSurgery as unknown as string)
          : undefined,
        useMedicine: useMedicine
          ? this.convertBooleanValue(useMedicine as unknown as string)
          : undefined,
      }),
      diagnosticData: getValidObjectValues({ diagnostic, treatmentPlan }),
    };
  }

  private addError(error: { error: string; patient: PatientDTO }) {
    const maxErrors = 1000;
    this.erroCounter++;
    if (this.errorList.length < maxErrors) {
      this.errorList.push(error);
    }
  }

  private async addPatientToBatch({
    patientDTO,
    locationDTO,
    anamnesisDTO,
    diagnosticDTO,
  }: {
    patientDTO: PatientDTO & { userId: string; id: string };
    locationDTO?: LocationDTO;
    anamnesisDTO?: Partial<AnamnesisDTO>;
    diagnosticDTO?: Partial<DiagnosticDTO>;
  }) {
    if (
      this.patientsBatch.some((patient) => {
        const { patientData } = patient;
        return patientData.hashData === patientDTO.hashData;
      })
    ) {
      this.duplicateCounter++;
      return;
    }

    this.patientsBatch.push({
      patientData: patientDTO,
      locationData: locationDTO,
      anamnesisData: anamnesisDTO,
      diagnosticData: diagnosticDTO,
    });

    if (this.patientsBatch.length >= this.updateBatch) {
      await this.savePatientsBatch();
    }
  }

  private async savePatientsBatch() {
    const getValidObjects = <T extends object>(data: T | undefined) =>
      data && Object.keys(getValidObjectValues<T>(data)).length > 0;

    try {
      const patientsData = this.patientsBatch.map((data) => data.patientData);

      const locationsData = this.patientsBatch
        .filter((data) => getValidObjects(data.locationData))
        .map((data) => ({
          ...data.locationData,
          patientId: data.patientData.id,
          userId: data.patientData.userId,
        }));

      const anamnesisData = this.patientsBatch
        .filter((data) => getValidObjects(data.anamnesisData))
        .map((data) => ({
          ...data.anamnesisData,
          userId: data.patientData.userId,
          patientId: data.patientData.id,
        }));

      const diagnosticData = this.patientsBatch
        .filter((data) => getValidObjects(data.diagnosticData))
        .map((data) => ({
          ...data.diagnosticData,
          userId: data.patientData.userId,
          patientId: data.patientData.id,
        }));

      await this.patientRepository.saveMany(patientsData);

      await Promise.all([
        locationsData.length > 0 &&
          this.locationRepository.saveMany(locationsData),
        anamnesisData.length > 0 &&
          this.anamnesisRepository.saveMany(anamnesisData),
        diagnosticData.length > 0 &&
          this.diagnosticRepository.saveMany(diagnosticData),
      ]);

      this.successCounter += this.patientsBatch.length;
    } catch (error: any) {
      this.patientsBatch.forEach((patient) => {
        const { patientData } = patient;
        return this.addError({
          error: error.message,
          patient: patientData,
        });
      });
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

  private convertBooleanValue(
    value: string,
    validValues: string[] = [],
  ): boolean {
    const values = [...validValues, "true", "sim"];
    const result = values.includes(value);

    return result;
  }
}
