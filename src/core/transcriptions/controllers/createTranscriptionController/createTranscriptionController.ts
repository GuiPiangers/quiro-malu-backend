import { Request, Response } from "express";
import { CreateTranscriptionUseCase } from "../../useCases/CreateTranscriptionUseCase";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import { convertToWav } from "../../../../utils/convertAudio";

export class CreateTranscriptionController {
  constructor(private createTranscription: CreateTranscriptionUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const audioBuffer = req.file?.buffer;
      if (!audioBuffer) throw new ApiError("Nenhum arquivo enviado", 400);

      const audioBufferWav = await convertToWav(audioBuffer);

      const transcription =
        await this.createTranscription.execute(audioBufferWav);

      return res.json(transcription);
    } catch (err: any) {
      return responseError(res, err);
    }
  }
}
