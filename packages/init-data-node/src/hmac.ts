/**
 * Signs specified data with the passed token using HMAC-SHA256.
 * @param data - data to sign.
 * @param token - token.
 * @returns Data signature.
 */
export async function createHmac(data: string, token: ArrayBuffer | string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();

  const tokenBytes = token instanceof ArrayBuffer ? token : encoder.encode(token)

  const key = await crypto.subtle.importKey(
    "raw",
    tokenBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return signature;
}