import { Readable, Stream, Transform, Writable } from "stream";
import { parse } from "fast-csv";

type callBackStream = <T>(error: Error | null, result: T) => void;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) =>
      setTimeout(() => reject(new Error("Transform operation timed out")), ms),
    ),
  ]);
}

abstract class IStream<chunk> {
  constructor(public stream: Stream) {
    this.setupEventListeners();
  }

  transform<k = chunk>(fn: (value: chunk) => k) {
    return new TransformCsv<k>(
      this.stream.pipe(
        new Transform({
          objectMode: true,
          highWaterMark: 16,

          transform(chunk, enc, cb) {
            try {
              const result = fn(chunk);
              if (result instanceof Promise) {
                withTimeout(result, 5000)
                  .then((res) => cb(null, res))
                  .catch((err) => cb(err));
              } else {
                cb(null, result);
              }
            } catch (error: any) {
              cb(error);
            }
          },
        }),
      ),
    );
  }

  write(fn: (value: chunk, cb: callBackStream) => void) {
    return this.stream.pipe(
      new Writable({
        objectMode: true,
        write(chunk, end, cb) {
          fn(chunk, cb);
          return cb();
        },
      }),
    );
  }

  private setupEventListeners() {
    this.stream.on("error", (err) => {
      console.error("Stream encountered an error:", err.message);
    });

    this.stream.on("end", () => {
      console.log("Stream processing has ended.");
    });

    this.stream.on("close", () => {
      console.log("Stream has been closed.");
    });
  }

  pipe(stream: Writable) {
    return this.stream.pipe(stream);
  }
}

class TransformCsv<chunk> extends IStream<chunk> {
  constructor(stream: Stream) {
    super(stream);
  }
}

export class CsvStream<chunk> extends IStream<chunk> {
  constructor(buffer: Buffer) {
    super(
      new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
        objectMode: true,
      }).pipe(parse({ headers: true })),
    );
  }
}
