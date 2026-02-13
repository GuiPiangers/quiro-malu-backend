import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RunDeployParams {
  image: string;
  tag: string;
  services: string[];
  composeFile: string;
}

interface RunDeployOptions {
  onError: (err: Error) => void;
  onSuccess: (stdout: string) => void;
}

function escapeShellArg(arg: string): string {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

export function runDeploy(
  { image, tag, composeFile, services }: RunDeployParams,
  { onError, onSuccess }: RunDeployOptions,
) {
  const imageEscaped = escapeShellArg(image);
  const tagEscaped = escapeShellArg(tag);
  const composeFileEscaped = escapeShellArg(composeFile);

  const servicesFlags = services
    .map((svc) => `--service ${escapeShellArg(svc)}`)
    .join(" ");

  const cmd = `bash /usr/local/bin/deploy.sh \
    --image ${imageEscaped} \
    --tag ${tagEscaped} \
    --compose-file ${composeFileEscaped} \
    ${servicesFlags}
  `;

  console.log("[DEPLOY] Executing command:", cmd);

  exec(
    cmd,
    {
      env: process.env,
      shell: "/bin/bash",
      timeout: 600000, // 10 minutos timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer para logs grandes
    },
    (err, stdout, stderr) => {
      if (err) {
        console.error("[DEPLOY] Error:", {
          code: err.code,
          message: err.message,
          stderr,
        });
        onError(err);
        return;
      }

      if (stderr) {
        console.warn("[DEPLOY] Warnings:", stderr);
      }

      console.log("[DEPLOY] Success:", stdout);
      onSuccess(stdout);
    },
  );
}

export async function runDeployAsync({
  image,
  tag,
  composeFile,
  services,
}: RunDeployParams): Promise<string> {
  const imageEscaped = escapeShellArg(image);
  const tagEscaped = escapeShellArg(tag);
  const composeFileEscaped = escapeShellArg(composeFile);

  const servicesFlags = services
    .map((svc) => `--service ${escapeShellArg(svc)}`)
    .join(" ");

  const cmd = `/usr/local/bin/deploy.sh \
    --image ${imageEscaped} \
    --tag ${tagEscaped} \
    --compose-file ${composeFileEscaped} \
    ${servicesFlags}
  `;

  try {
    const { stdout, stderr } = await execAsync(cmd, {
      env: process.env,
      timeout: 600000,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (stderr) {
      console.warn("[DEPLOY] Warnings:", stderr);
    }

    return stdout;
  } catch (error) {
    const err = error as Error & { code?: number; stderr?: string };
    console.error("[DEPLOY] Error:", {
      code: err.code,
      message: err.message,
      stderr: err.stderr,
    });
    throw error;
  }
}
