import { GetServiceUseCase } from "../../useCases/getService/GetServiceUseCase";
import { Request, Response } from "express";
import { ServiceDTO } from "../../models/Service";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class GetServiceController {
    constructor(private getServiceUseCase: GetServiceUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params
            const userId = request.user.id

            if (!id) throw new ApiError('O id e o patientId devem ser informados', 400)

            const Service = await this.getServiceUseCase.execute({ id, userId: userId! })
            response.status(200).json(Service)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}