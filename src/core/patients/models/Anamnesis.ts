import { Entity } from "../../shared/Entity";

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
  readonly patientId: string | null;
  readonly mainProblem: string | null;
  readonly currentIllness: string | null;
  readonly history: string | null;
  readonly familiarHistory: string | null;
  readonly activities: string | null;
  readonly smoke: "yes" | "no" | "passive" | null;
  readonly useMedicine: boolean | null;
  readonly medicines: string | null;
  readonly underwentSurgery: boolean | null;
  readonly surgeries: string | null;

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
    this.patientId = patientId || null;
    this.mainProblem = mainProblem || null;
    this.currentIllness = currentIllness || null;
    this.history = history || null;
    this.familiarHistory = familiarHistory || null;
    this.activities = activities || null;
    this.smoke = smoke || null;
    this.useMedicine = useMedicine || null;
    this.medicines = medicines || null;
    this.underwentSurgery = underwentSurgery || null;
    this.surgeries = surgeries || null;
  }
}
