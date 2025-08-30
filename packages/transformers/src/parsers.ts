import { parse } from 'valibot';

import { initDataQuery, launchParamsQuery } from './structures.js';

export function parseInitDataQuery(value: string | URLSearchParams) {
  return parse(initDataQuery(), value);
}

export function parseLaunchParamsQuery(value: string | URLSearchParams) {
  return parse(launchParamsQuery(), value);
}
