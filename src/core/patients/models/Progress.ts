import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface ProgressDTO {
  id?: string;
  patientId: string;
  service: string | null;
  actualProblem: string | null;
  procedures: string | null;
  date: string | null;
  createAt?: string;
  updateAt?: string;
}

export class Progress extends Entity {
  readonly date: DateTime | null;
  readonly patientId: string;
  readonly service: string | null;
  readonly actualProblem: string | null;
  readonly procedures: string | null;

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
    if (date) this.date = new DateTime(date, { onlyPassDate: true });
    this.procedures = procedures;
  }

  getDTO(): ProgressDTO {
    return {
      id: this.id,
      patientId: this.patientId,
      service: this.service || null,
      actualProblem: this.actualProblem || null,
      date: this.date?.value || null,
      procedures: this.procedures || null,
    };
  }
}
