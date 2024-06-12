import { createHmac } from 'node:crypto';

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @returns Data sign.
 */
function signData(
  data: string,
  key: string,
  createHmac: (data: string, key: string | Buffer) => Buffer,
): string;

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @returns Data sign.
 */
function signData(
  data: string,
  key: string,
  createHmac: (data: string, key: string | Buffer) => Promise<Buffer>,
): Promise<string>;

function signData(
  data: string,
  key: string,
  createHmac: (data: string, key: string | Buffer) => (Buffer | Promise<Buffer>),
): string | Promise<string> {
  const keyHmac = createHmac(key, 'WebAppData');

  return keyHmac instanceof Promise
    ? keyHmac
      .then(v => createHmac(data, v))
      .then(v => v.toString('hex'))
    : (createHmac(data, keyHmac) as Buffer).toString('hex');
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @returns Data sign.
 */
export function signDataNode(data: string, key: string): string {
  return signData(data, key, (d, k) => {
    return createHmac('sha256', k).update(d).digest();
  });
}

/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @returns Data sign.
 */
export async function signDataWeb(data: string, key: string): Promise<string> {
  return signData(data, key, async (d, k) => {
    const encoder = new TextEncoder();

    return Buffer.from(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          typeof k === 'string' ? encoder.encode(k) : k,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign', 'verify'],
        ),
        encoder.encode(d),
      ),
    );
  });
}
