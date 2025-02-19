import { Scheduling, SchedulingDTO, SchedulingStatus } from "./Scheduling";
import { StatusStrategy } from "./status/StatusStrategy";

export type SchedulingWithPatientDTO = SchedulingDTO & {
  patient: string;
  phone: string;
};

export class SchedulingWithPatient extends Scheduling {
  readonly patient: string;
  readonly phone: string;

  constructor(
    {
      patient,
      patientId,
      phone,
      createAt,
      date,
      duration,
      id,
      service,
      status,
      updateAt,
    }: SchedulingWithPatientDTO,
    statusStrategy?: StatusStrategy,
  ) {
    super(
      {
        patientId,
        createAt,
        date,
        duration,
        id,
        service,
        status,
        updateAt,
      },
      statusStrategy,
    );

    this.patient = patient;
    this.phone = phone;
  }

  getDTO() {
    return {
      ...super.getDTO(),
      patient: this.patient,
      phone: this.phone,
    };
  }
}
