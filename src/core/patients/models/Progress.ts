import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface ProgressDTO {
  id?: string;
  patientId: string;
  service?: string;
  actualProblem?: string;
  procedures?: string;
  date?: string;
  createAt?: string;
  updateAt?: string;
}

export class Progress extends Entity {
  readonly date?: DateTime;
  readonly patientId: string;
  readonly service?: string;
  readonly actualProblem?: string;
  readonly procedures?: string;

  constructor({
    id,
    service,
    actualProblem,
    date,
    procedures,
    patientId,
  }: ProgressDTO) {
    super(id || `${Date.now()}`);
    this.patientId = patientId;
    this.service = service;
    this.actualProblem = actualProblem;
    if (date) this.date = new DateTime(date);
    this.procedures = procedures;
  }

  getDTO(): ProgressDTO {
    return {
      id: this.id,
      patientId: this.patientId,
      service: this.service,
      actualProblem: this.actualProblem,
      date: this.date?.value,
      procedures: this.procedures,
    };
  }
}
