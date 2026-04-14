import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { ProcessWhatsAppWebhookUseCase } from "../../useCases/processWhatsAppWebhook/ProcessWhatsAppWebhookUseCase";

function verifyWebhookSecret(request: Request): void {
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
  if (!secret?.trim()) return;

  const headerSecret =
    request.headers["x-webhook-secret"] ??
    request.headers["x-webhook-token"] ??
    request.headers.apikey;

  const received =
    typeof headerSecret === "string"
      ? headerSecret
      : Array.isArray(headerSecret)
        ? headerSecret[0]
        : "";

  if (received !== secret) {
    throw new ApiError("Webhook não autorizado", 401);
  }
}

export class WhatsAppWebhookController {
  constructor(
    private processWhatsAppWebhookUseCase: ProcessWhatsAppWebhookUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      verifyWebhookSecret(request);

      const body = request.body as Record<string, unknown>;
      await this.processWhatsAppWebhookUseCase.execute(body);

      return response.status(200).send("ok");
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}
