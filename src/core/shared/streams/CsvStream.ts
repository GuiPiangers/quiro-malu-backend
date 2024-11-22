import { Readable, Stream, Transform, Writable } from "stream";
import { parse } from "fast-csv";

abstract class IStream<chunk> {
  constructor(protected stream: Stream) {}

  abstract transform<k = chunk>(fn: (value: chunk) => k): IStream<k>;

  protected createTransform<k = chunk>(fn: (value: chunk) => k) {
    return this.stream.pipe(
      new Transform({
        objectMode: true,

        transform(chunk, enc, cb) {
          const result = fn(chunk);
          cb(null, result);
        },
      }),
    );
  }

  write(fn: (value: chunk) => void) {
    return this.stream.pipe(
      new Writable({
        objectMode: true,
        write(chunk, end, cb) {
          fn(chunk);
          return cb();
        },
      }),
    );
  }
}

class TransformCsv<chunk> extends IStream<chunk> {
  constructor(stream: Stream) {
    super(stream);
  }

  transform<k = chunk>(fn: (value: chunk) => k): IStream<k> {
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

  transform<k = chunk>(fn: (value: chunk) => k) {
    const newStream = this.createTransform(fn);
    return new TransformCsv<k>(newStream);
  }
}
