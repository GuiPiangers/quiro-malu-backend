import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface FinanceDOT {
  id?: string;
  date: string;
  description: string;
  type: "income" | "expense";
  paymentMethod: string;
  value: number;
  patientId?: string;
}

export class Finance extends Entity {
  readonly date: string;
  readonly description: string;
  readonly type: "income" | "expense";
  readonly paymentMethod: string;
  readonly value: number;
  readonly patientId?: string;

  constructor({
    date,
    description,
    paymentMethod,
    type,
    value,
    patientId,
    id,
  }: FinanceDOT) {
    super(id);

    this.date = new DateTime(date).date;
    this.description = description;
    this.type = type;
    this.paymentMethod = paymentMethod;
    this.value = value;
    this.patientId = patientId;
  }
}
