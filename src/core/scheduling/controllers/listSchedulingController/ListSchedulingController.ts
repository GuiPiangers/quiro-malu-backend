import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";

export class ListSchedulingController {
    constructor(private listSchedulingUseCase: ListSchedulingUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const { page } = request.query
            const { patientId } = request.params
            const userId = request.user.id

            const scheduling = await this.listSchedulingUseCase.execute({ patientId, userId: userId!, page: +page! as number })
            response.status(200).json(scheduling)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}