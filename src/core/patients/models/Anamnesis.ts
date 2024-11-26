export interface AnamnesisDTO {
  patientId: string;
  mainProblem: string;
  currentIllness: string;
  history: string;
  familiarHistory: string;
  activities: string;
  smoke: "yes" | "no" | "passive";
  useMedicine: boolean;
  medicines: string;
  underwentSurgery: boolean;
  surgeries: string;
}

export class Anamnesis {
  readonly patientId: string;
  readonly mainProblem: string;
  readonly currentIllness: string;
  readonly history: string;
  readonly familiarHistory: string;
  readonly activities: string;
  readonly smoke: "yes" | "no" | "passive";
  readonly useMedicine: boolean;
  readonly medicines: string;
  readonly underwentSurgery: boolean;
  readonly surgeries: string;

  constructor({
    patientId,
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
  }: AnamnesisDTO) {
    this.patientId = patientId;
    this.mainProblem = mainProblem;
    this.currentIllness = currentIllness;
    this.history = history;
    this.familiarHistory = familiarHistory;
    this.activities = activities;
    this.smoke = smoke;
    this.useMedicine = useMedicine;
    this.medicines = medicines;
    this.underwentSurgery = underwentSurgery;
    this.surgeries = surgeries;
  }
}
