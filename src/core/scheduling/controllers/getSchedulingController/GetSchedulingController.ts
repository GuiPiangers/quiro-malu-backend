import { GetSchedulingUseCase } from "../../useCases/getScheduling/GetSchedulingUseCase";
import { Request, Response } from "express";
import { SchedulingDTO } from "../../models/Scheduling";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class GetSchedulingController {
    constructor(private getSchedulingUseCase: GetSchedulingUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params
            const userId = request.user.id

            if (!id) throw new ApiError('Deve ser informado o Id e o PatientId', 400)

            const scheduling = await this.getSchedulingUseCase.execute({ id, userId: userId! })
            response.status(200).json(scheduling)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}