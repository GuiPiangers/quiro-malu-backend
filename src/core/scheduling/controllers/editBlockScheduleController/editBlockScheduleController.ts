import { Request, Response } from "express";
import {
  EditBlockScheduleDTO,
  EditBlockScheduleUseCase,
} from "../../useCases/blockScheduling/editBlockScheduleUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class EditBlockScheduleController {
  constructor(private editBlockScheduleUseCase: EditBlockScheduleUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;
      const data = request.body as EditBlockScheduleDTO;

      await this.editBlockScheduleUseCase.execute({ ...data, id }, userId!);

      return response.status(200).json({ message: "Atualizado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
