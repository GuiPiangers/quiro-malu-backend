import { Readable, Transform } from "stream";
import { parse } from "fast-csv";

export class CsvStream {
  private stream: Readable;
  constructor(buffer: Buffer) {
    this.stream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
      objectMode: true,
    }).pipe(parse({ headers: true }));
  }

  transform(fn: (value: any) => any) {
    this.stream = this.stream.pipe(
      new Transform({
        objectMode: true,

        transform(chunk, enc, cb) {
          const result = fn(chunk);
          cb(null, result);
        },
      }),
    );

    return this;
  }
}
