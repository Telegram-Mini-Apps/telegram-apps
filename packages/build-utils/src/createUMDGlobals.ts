/**
 * Creates globals which are usually used in UMD packages.
 * @param deps - dependencies list.
 */
export function createUMDGlobals(deps: string[]): Record<string, string> {
  return deps.reduce<Record<string, string>>((acc, dep) => {
    acc[dep] = dep;
    return acc;
  }, {});
}