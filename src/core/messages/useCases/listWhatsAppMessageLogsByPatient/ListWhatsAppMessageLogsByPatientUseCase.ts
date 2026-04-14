import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";
import {
  ListWhatsAppMessageLogsOutput,
  ListWhatsAppMessageLogsUseCase,
} from "../listWhatsAppMessageLogs/ListWhatsAppMessageLogsUseCase";

export type ListWhatsAppMessageLogsByPatientInput = {
  userId: string;
  patientId: string;
  page?: number;
  limit?: number;
};

export class ListWhatsAppMessageLogsByPatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private listWhatsAppMessageLogsUseCase: ListWhatsAppMessageLogsUseCase,
  ) {}

  async execute(
    input: ListWhatsAppMessageLogsByPatientInput,
  ): Promise<ListWhatsAppMessageLogsOutput> {
    const [patient] = await this.patientRepository.getById(
      input.patientId,
      input.userId,
    );

    if (!patient) {
      throw new ApiError("Paciente não encontrado", 404);
    }

    return this.listWhatsAppMessageLogsUseCase.execute({
      userId: input.userId,
      patientId: input.patientId,
      page: input.page,
      limit: input.limit,
    });
  }
}
