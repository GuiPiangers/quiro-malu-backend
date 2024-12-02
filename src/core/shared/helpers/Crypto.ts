import bcrypt from "bcrypt";
import { createHash } from "crypto";

export abstract class Crypto {
  static createRandomHash(value: string) {
    return bcrypt.hash(value, 10);
  }

  static createFixedHash(value: string) {
    const result = createHash("sha256")
      .update(JSON.stringify(value))
      .digest("hex");
    return result;
  }

  static compareRandomHash(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
