import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";

export class ListServiceController {
    constructor(private listServiceUseCase: ListServiceUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const { page } = request.query
            const userId = request.user.id

            const Service = await this.listServiceUseCase.execute({ userId: userId!, page: +page! as number })
            response.status(200).json(Service)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}