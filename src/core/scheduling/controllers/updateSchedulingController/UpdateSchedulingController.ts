import { UpdateSchedulingUseCase } from "../../useCases/updateScheduling/UpdateSchedulingUseCase";
import { Request, Response } from "express";
import { SchedulingDTO } from "../../models/Scheduling";
import { responseError } from "../../../../utils/ResponseError";

export class UpdateSchedulingController {
    constructor(private updateSchedulingUseCase: UpdateSchedulingUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as SchedulingDTO
            const userId = request.user.id

            const scheduling = await this.updateSchedulingUseCase.execute({ ...data, userId: userId! })
            response.status(201).json(scheduling)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}