import { SignData } from './types.js';
import { signData } from './signData.js';
import { initDataToSearchParams } from './initDataToSearchParams.js';

/**
 * Signs specified init data.
 * @param data - init data to sign.
 * @param authDate - date, when this init data should be signed.
 * @param token - bot token.
 * @returns Signed init data presented as query parameters.
 */
export async function sign(data: SignData, token: string, authDate: Date): Promise<string> {
  // Create search parameters, which will be signed further.
  const sp = initDataToSearchParams({
    ...data,
    authDate,
  });

  // Convert search params to pairs and sort the final array.
  const pairs = [...sp.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .sort();

  // Compute sign, append it to the params and return.
  sp.append('hash', await signData(pairs.join('\n'), token));

  return sp.toString();
}