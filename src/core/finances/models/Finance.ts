import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface FinanceDTO {
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
  }: FinanceDTO) {
    super(id);

    this.date = new DateTime(date).date;
    this.description = description;
    this.type = type;
    this.paymentMethod = paymentMethod;
    this.value = value;
    this.patientId = patientId;
  }

  getDTO(): FinanceDTO {
    return {
      date: this.date,
      description: this.description,
      type: this.type,
      paymentMethod: this.paymentMethod,
      value: this.value,
      patientId: this.patientId,
    };
  }
}
