import { Request, Response } from "express";
import { DeleteServiceUseCase } from "../../useCases/deleteService/DeleteServiceUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class DeleteServiceController {
    constructor(private deleteServiceUseCase: DeleteServiceUseCase) { }
    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = request.user.id
            const { id } = request.body
            await this.deleteServiceUseCase.execute({ id, userId: userId! })

            response.json({ message: 'Paciente deletado com sucesso!' })
        } catch (err: any) {
            responseError(response, err)
        }
    }

}