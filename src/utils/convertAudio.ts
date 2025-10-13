import { spawn } from "child_process";

export async function convertToWav(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-ar",
      "16000",
      "-ac",
      "1",
      "-f",
      "wav",
      "pipe:1",
    ]);

    const chunks: Buffer[] = [];

    ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
    ffmpeg.stderr.on("data", (err) => console.error("FFmpeg:", err.toString()));

    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`FFmpeg process exited with code ${code}`));
    });

    ffmpeg.stdin.write(buffer);
    ffmpeg.stdin.end();
  });
}
