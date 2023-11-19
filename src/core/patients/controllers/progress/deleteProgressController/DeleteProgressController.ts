import { Request, Response } from "express";
import { DeleteProgressUseCase } from "../../../useCases/progress/deleteProgress/DeleteProgressUseCase";
import { responseError } from "../../../../../utils/ResponseError";

export class DeleteProgressController {
    constructor(private deleteProgressUseCase: DeleteProgressUseCase) { }
    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { id, patientId } = request.body
            await this.deleteProgressUseCase.execute({ id, patientId, userId: userId! })

            response.json({ message: 'Paciente deletado com sucesso!' })
        } catch (err: any) {
            responseError(response, err)
        }
    }

}