import { createAssignChecks } from '@/scopes/toolkit/createAssignChecks.js';
import type { IsSupported } from '@/scopes/toolkit/assignChecks.js';

export function createAssignSupported(
  component: string,
  isSupported: IsSupported,
) {
  return createAssignChecks(component, { isSupported });
}