import crypto from 'crypto';

export function verifySignature(
    rawBody: Buffer,
    signatureHeader: string | undefined,
    secret: string
): boolean {
    if (!signatureHeader) return false;

    const expected = 'sha256=' +
        crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signatureHeader)
    );
}