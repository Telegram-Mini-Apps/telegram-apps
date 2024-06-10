/**
 * Signs specified data with the passed key using HMAC-SHA256.
 * @param data - data to sign.
 * @param key - token.
 * @returns Promise containing data signature.
 */
export async function createHmac(data: string, key: ArrayBuffer | string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();

  return crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      key instanceof ArrayBuffer ? key : encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    ),
    encoder.encode(data),
  );
}