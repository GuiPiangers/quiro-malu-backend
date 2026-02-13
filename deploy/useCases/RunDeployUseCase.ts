import path from "path";
import { runDeploy } from "../utils/runDeploy";
import { verifySignature } from "../utils/verifySignature";
import { isDeployInProgress, setDeployInProgress } from "../state/deployState";

interface DeployPayload {
  image?: string;
  tag?: string;
  services?: unknown;
}

interface RunDeployInput {
  rawBody?: Buffer;
  signature?: string;
  secret?: string;
  payload: DeployPayload;
  composeFile: string;
}

interface RunDeployOutput {
  message: string;
  image: string;
  services: string[];
}

class DeployValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

const IMAGE_REGEX = /^[a-zA-Z0-9/_-]+$/;
const TAG_REGEX = /^[a-zA-Z0-9._-]+$/;
const SERVICE_REGEX = /^[a-zA-Z0-9_-]+$/;

export class RunDeployUseCase {
  execute({
    rawBody,
    signature,
    secret,
    payload,
    composeFile,
  }: RunDeployInput): RunDeployOutput {
    if (!rawBody) {
      throw new DeployValidationError("Raw body missing", 400);
    }

    if (!secret) {
      throw new DeployValidationError("DEPLOY_SECRET is not configured", 500);
    }

    const validSignature = verifySignature(rawBody, signature, secret);
    if (!validSignature) {
      console.error("[SECURITY] Invalid signature attempt");
      throw new DeployValidationError("Invalid signature", 401);
    }

    const { image, tag, services } = payload;

    if (!image || !tag || !services) {
      throw new DeployValidationError("Missing required fields", 400, {
        required: ["image", "tag", "services"],
      });
    }

    if (!Array.isArray(services) || services.length === 0) {
      throw new DeployValidationError(
        "services must be a non-empty array",
        400,
      );
    }

    if (!IMAGE_REGEX.test(image)) {
      throw new DeployValidationError("Invalid image name format", 400);
    }

    if (!TAG_REGEX.test(tag)) {
      throw new DeployValidationError("Invalid tag format", 400);
    }

    if (services.some((service) => typeof service !== "string")) {
      throw new DeployValidationError(
        "services must contain only strings",
        400,
      );
    }

    if (services.some((service) => !SERVICE_REGEX.test(service))) {
      throw new DeployValidationError("Invalid service name format", 400);
    }

    const normalizedPath = path.normalize(composeFile);
    if (normalizedPath.includes("..") || !path.isAbsolute(normalizedPath)) {
      throw new DeployValidationError("Invalid compose file path", 400);
    }

    if (isDeployInProgress()) {
      throw new DeployValidationError("Deploy already in progress", 409, {
        message: "Please wait for the current deployment to finish",
      });
    }

    const typedServices = services as string[];

    console.log("[DEPLOY] Starting deployment:", {
      image,
      tag,
      services: typedServices,
      composeFile: normalizedPath,
      timestamp: new Date().toISOString(),
    });

    setDeployInProgress(true);

    runDeploy(
      { image, tag, services: typedServices, composeFile: normalizedPath },
      {
        onError: (err) => {
          console.error("[DEPLOY] Failed:", err.message);
          setDeployInProgress(false);
        },
        onSuccess: (stdout) => {
          console.log("[DEPLOY] Success:", stdout);
          setDeployInProgress(false);
        },
      },
    );

    return {
      message: "Deploy accepted and started",
      image: `${image}:${tag}`,
      services: typedServices,
    };
  }
}

export function isDeployValidationError(
  err: unknown,
): err is DeployValidationError {
  return err instanceof DeployValidationError;
}
