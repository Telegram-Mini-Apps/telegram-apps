import { expect, it } from 'vitest';

import { intToHexColor } from "@/utils/intToHexColor.js";

it('should return hex #ffffff', () => {
  expect(intToHexColor(-1)).toBe('#ffffff');
});

it('should return hex #64b5ef', () => {
  expect(intToHexColor(-10177041)).toBe('#64b5ef');
});

it('should return input value in hex', () => {
  expect(intToHexColor('#ffffff')).toBe('#ffffff');
});

it('should return undefined', () => {
  expect(intToHexColor(undefined)).toBe(undefined);
});
