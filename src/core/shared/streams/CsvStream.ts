import { Readable, Stream, Transform, Writable } from "stream";
import { parse } from "fast-csv";

type callBackStream = <T>(error: Error | null, result: T) => void;

abstract class IStream<chunk> {
  constructor(public stream: Stream) {}

  abstract transform<k = chunk>(
    fn: (value: chunk, cb: callBackStream) => k,
  ): IStream<k>;

  protected createTransform<k = chunk>(
    fn: (value: chunk, cb: callBackStream) => k,
  ) {
    return this.stream.pipe(
      new Transform({
        objectMode: true,

        transform(chunk, enc, cb) {
          const result = fn(chunk, cb);
          if (result instanceof Promise) {
            result.then((res) => {
              cb(null, res);
            });
          } else {
            cb(null, result);
          }
        },
      }),
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

  pipe(stream: Writable) {
    return this.stream.pipe(stream);
  }
}

class TransformCsv<chunk> extends IStream<chunk> {
  constructor(stream: Stream) {
    super(stream);
  }

  transform<k = chunk>(
    fn: (value: chunk, cb: callBackStream) => k,
  ): IStream<k> {
    return new TransformCsv<k>(this.createTransform(fn));
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

  transform<k = chunk>(fn: (value: chunk, cb: callBackStream) => k) {
    const newStream = this.createTransform(fn);
    return new TransformCsv<k>(newStream);
  }
}
