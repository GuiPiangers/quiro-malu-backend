import { Readable, Stream, Transform, Writable } from "stream";
import { parse } from "fast-csv";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) =>
      setTimeout(() => reject(new Error("Transform operation timed out")), ms),
    ),
  ]);
}

type DefaultEvents = {
  onError?: (err: any) => void;
  onData?: (chunk: any) => void;
  onEnd?: () => void;
  onPause?: () => void;
  onReadable?: () => void;
  onClose?: () => void;
};

abstract class IStream<chunk> {
  constructor(
    public stream: Stream,
    private defaultEvents: DefaultEvents = {},
  ) {
    this.setupEventListeners();
  }

  transform<k = chunk>(fn: (value: chunk) => k | Promise<k>) {
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
      this.defaultEvents,
    );
  }

  write<k = chunk>(fn: (value: chunk) => k | Promise<k>) {
    return this.stream.pipe(
      new Writable({
        objectMode: true,
        write(chunk, end, cb) {
          const result = fn(chunk);
          if (result instanceof Promise) {
            withTimeout(result, 5000)
              .then(() => cb(null))
              .catch((err) => cb(err));
          } else {
            cb(null);
          }
        },
      }),
    );
  }

  private setupEventListeners() {
    if (this.defaultEvents) {
      const { onClose, onData, onEnd, onError, onPause, onReadable } =
        this.defaultEvents;
      onError && this.stream.on("error", onError);
      onData && this.stream.on("data", onData);
      onEnd && this.stream.on("end", onEnd);
      onPause && this.stream.on("pause", onPause);
      onReadable && this.stream.on("readable", onReadable);
      onClose && this.stream.on("close", onClose);
    }
  }

  pipe(stream: Writable) {
    return this.stream.pipe(stream);
  }
}

class TransformCsv<chunk> extends IStream<chunk> {
  constructor(stream: Stream, defaultEvents: DefaultEvents = {}) {
    super(stream, defaultEvents);
  }
}

export class CsvStream<chunk> extends IStream<chunk> {
  constructor(buffer: Buffer, defaultEvents: DefaultEvents = {}) {
    super(
      new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
        objectMode: true,
      }).pipe(parse({ headers: true })),
      defaultEvents,
    );
  }
}
