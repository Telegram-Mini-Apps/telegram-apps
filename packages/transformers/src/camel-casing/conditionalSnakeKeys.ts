import { transform, type TransformAction } from 'valibot';
import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
  type If,
} from '@telegram-apps/toolkit';

export type ConditionalSnakeKeysAction<Input extends object, CamelCase extends boolean> =
  TransformAction<
    Input,
    If<CamelCase, DeepConvertSnakeKeysToCamelCase<Input>, Input>
  >;

/**
 * Conditionally applies `deepSnakeToCamelObjKeys` to the input.
 * @param camelCase - true if the camel-casing must be applied.
 */
export function conditionalSnakeKeys<Input extends object>(
  camelCase?: boolean,
): ConditionalSnakeKeysAction<Input, false>;

/**
 * Conditionally applies `deepSnakeToCamelObjKeys` to the input.
 * @param camelCase - true if the camel-casing must be applied.
 */
export function conditionalSnakeKeys<Input extends object>(
  camelCase: true,
): ConditionalSnakeKeysAction<Input, true>;

/**
 * Conditionally applies `deepSnakeToCamelObjKeys` to the input.
 * @param camelCase - true if the camel-casing must be applied.
 */
export function conditionalSnakeKeys(camelCase?: boolean): ConditionalSnakeKeysAction<object, boolean> {
  return transform(input => {
    return camelCase ? deepSnakeToCamelObjKeys(input) : input;
  });
}