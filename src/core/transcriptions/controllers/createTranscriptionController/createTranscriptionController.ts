import { Request, Response } from "express";
import { CreateTranscriptionUseCase } from "../../useCases/CreateTranscriptionUseCase";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";

export class CreateTranscriptionController {
  constructor(private createTranscription: CreateTranscriptionUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const audioBuffer = req.file?.buffer;
      if (!audioBuffer) throw new ApiError("Nenhum arquivo enviado", 400);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const emitter = this.createTranscription.execute(audioBuffer);

      emitter.on("data", (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      });

      emitter.on("end", () => {
        res.write("event: end\ndata: done\n\n");
        res.end();
      });
    } catch (err: any) {
      return responseError(res, err);
    }
  }
}
