import { UpdateServiceUseCase } from "../../useCases/updateService/UpdateServiceUseCase";
import { Request, Response } from "express";
import { ServiceDTO } from "../../models/Service";
import { responseError } from "../../../../utils/ResponseError";

export class UpdateServiceController {
    constructor(private updateServiceUseCase: UpdateServiceUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as ServiceDTO
            const userId = request.user.id

            const service = await this.updateServiceUseCase.execute({ ...data, userId: userId! })
            response.status(201).json(service)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}