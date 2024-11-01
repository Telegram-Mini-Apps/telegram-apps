import { createAssignChecks } from '@/scopes/toolkit/createAssignChecks.js';

export function createAssignMounted(
  component: string,
  isMounted: () => boolean,
  checkInit?: boolean,
) {
  return createAssignChecks(component, { isMounted, checkInit });
}