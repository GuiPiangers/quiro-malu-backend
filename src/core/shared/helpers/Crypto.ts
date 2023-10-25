import bcrypt from "bcrypt";

export abstract class Crypto {
    static createHash(value: string) {
        return bcrypt.hash(value, 10)
    }

    static compareHash(value: string, hash: string) {
        return bcrypt.compare(value, hash)
    }
}