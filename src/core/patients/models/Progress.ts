import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export class PainScaleDto {
  id?: string;
  painLevel: number;
  description: string;
}

export class PainScale extends Entity {
  private readonly minPainScale = 0;
  private readonly maxPainScale = 10;
  readonly painLevel: number;
  readonly description: string;

  constructor({ description, painLevel, id }: PainScaleDto) {
    super(id);

    this.validateMinMax(painLevel);

    this.painLevel = painLevel;
    this.description = description;
  }

  private validateMinMax(painLevel: number) {
    if (painLevel < this.minPainScale)
      throw new ApiError(
        `O valor mínimo para a escala de dor é ${this.minPainScale}`,
      );

    if (painLevel > this.maxPainScale)
      throw new ApiError(
        `O valor máximo para a escala de dor é ${this.maxPainScale}`,
      );
  }

  getDTO() {
    return {
      painLevel: this.painLevel,
      description: this.description,
    };
  }
}
export interface ProgressDTO {
  id?: string;
  schedulingId?: string;
  patientId: string;
  service?: string;
  actualProblem?: string;
  procedures?: string;
  date?: string;
  createAt?: string;
  updateAt?: string;
  painScales?: PainScaleDto[];
}

export class Progress extends Entity {
  readonly date?: DateTime;
  readonly patientId: string;
  readonly service?: string;
  readonly actualProblem?: string;
  readonly procedures?: string;
  readonly schedulingId?: string;
  readonly painScales?: PainScale[];

  constructor({
    id,
    service,
    actualProblem,
    date,
    procedures,
    patientId,
    schedulingId,
    painScales,
  }: ProgressDTO) {
    super(id || `${Date.now()}`);
    this.patientId = patientId;
    this.service = service;
    this.actualProblem = actualProblem;
    if (date) this.date = new DateTime(date);
    this.procedures = procedures;
    this.schedulingId = schedulingId;
    this.painScales = painScales?.map((painScale) => new PainScale(painScale));
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      service: this.service,
      actualProblem: this.actualProblem,
      date: this.date?.dateTime,
      procedures: this.procedures,
      schedulingId: this.schedulingId,
      painScales: this.painScales?.map((painScale) => painScale.getDTO()),
    };
  }
}
