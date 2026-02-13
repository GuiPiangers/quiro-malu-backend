import { Response } from "express";
import { RequestWithRawBody } from "../types/RequestWithRawBody";
import {
  isDeployValidationError,
  RunDeployUseCase,
} from "../useCases/RunDeployUseCase";

const PRODUCTION_COMPOSE_FILE =
  "/home/gui_piangers/Programacao/QuiroMalu/quiro-malu-backend/docker-compose.prod.yml";

export class ProductionDeployController {
  constructor(private readonly runDeployUseCase: RunDeployUseCase) {}

  handle(req: RequestWithRawBody, res: Response) {
    try {
      const output = this.runDeployUseCase.execute({
        rawBody: req.rawBody,
        signature: req.header("X-Deploy-Signature"),
        secret: process.env.DEPLOY_SECRET,
        payload: req.body,
        composeFile: PRODUCTION_COMPOSE_FILE,
      });

      return res.status(202).json(output);
    } catch (err) {
      if (isDeployValidationError(err)) {
        const body = err.details
          ? { error: err.message, ...err.details }
          : { error: err.message };
        return res.status(err.statusCode).json(body);
      }

      console.error("[DEPLOY] Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected internal error" });
    }
  }
}
