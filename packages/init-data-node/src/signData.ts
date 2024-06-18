/**
 * Signs specified data with the passed token.
 * @param data - data to sign.
 * @param key - private key.
 * @param createHmac - function to create HMAC-SHA256.
 * @returns Data sign.
 */
export function signData(
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
export function signData(
  data: string,
  key: string,
  createHmac: (data: string, key: string | Buffer) => Promise<Buffer>,
): Promise<string>;

export function signData(
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
