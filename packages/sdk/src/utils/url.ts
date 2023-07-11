/**
 * Converts passed URL to its full form.
 * TODO: Maybe, there is a bit easier way? window.open will accept
 *  unformatted URL too, probably.
 *
 * @param url - URL to format.
 * @throws {Error} URL protocol is not supported by OS, or link has not allowed
 * protocol.
 */
export function formatURL(url: string): string {
  // We do create new anchor element and assign its href to passed URL. This
  // will format link, so it could be used in `window.open`.
  const anchor = document.createElement('a');
  anchor.href = url;

  // Check if protocol is correct.
  if (anchor.protocol !== 'http:' && anchor.protocol !== 'https:') {
    throw Error(
      'URL protocol is not supported by OS, or link has not allowed '
      + `protocol: ${anchor.protocol}`,
    );
  }
  return anchor.href;
}
