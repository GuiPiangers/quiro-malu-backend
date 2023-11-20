import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { Request, Response } from "express";
import { ServiceDTO } from "../../models/Service";
import { responseError } from "../../../../utils/ResponseError";

export class CreateServiceController {
    constructor(private createServiceUseCase: CreateServiceUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as ServiceDTO
            const userId = request.user.id

            const service = await this.createServiceUseCase.execute({ ...data, userId: userId! })
            response.status(201).json(service)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}