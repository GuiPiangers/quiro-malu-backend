import { IProgressRepository } from "../../../../../repositories/progress/IProgressRepository";

export class DeleteProgressUseCase {
  constructor(private ProgressRepository: IProgressRepository) {}

  async execute({
    id,
    patientId,
    clinicId,
  }: {
    id: string;
    patientId: string;
    clinicId: string;
  }) {
    await this.ProgressRepository.delete({ id, patientId, clinicId });
  }
}
