import {
  type MethodName,
  supports,
  type MethodNameWithVersionedParams,
  type MethodVersionedParams,
} from '@tma.js/bridge';
import { type Computed, computed } from '@tma.js/signals';
import type { If, IsNever } from '@tma.js/toolkit';
import type { Version } from '@tma.js/types';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

import { FunctionUnavailableError } from '@/errors.js';
import type { AnyFn, MaybeAccessor } from '@/types.js';
import { access } from '@/helpers/access.js';

/**
 * @returns Error text if something is wrong.
 */
export type CustomSupportValidatorFn = () => string | undefined;

export type IsSupportedType =
  | MethodName
  | CustomSupportValidatorFn
  | { every: (MethodName | CustomSupportValidatorFn)[] }
  | { some: (MethodName | CustomSupportValidatorFn)[] };

/**
 * A map where the key is a method name with versioned parameters, and the value is a tuple
 * containing the method and parameter names. The third tuple value is a function accepting
 * the wrapped function arguments and returning true if support check must be applied.
 */
export type Supports<Args extends any[]> = {
  [OptionName: string]: {
    [M in MethodNameWithVersionedParams]: {
      /**
       * Method name.
       * @example 'web_app_set_header_color'
       */
      method: M;
      /**
       * Method version-dependent parameter.
       * @example `color`
       */
      param: MethodVersionedParams<M>;
      /**
       * @returns True if the support function should be called.
       * @param args - function arguments.
       */
      shouldCheck: (...args: Args) => boolean;
    };
  }[MethodNameWithVersionedParams];
};

type AnyFpFn = (...args: any[]) => E.Either<any, any> | TE.TaskEither<any, any>;

type IfReturnsTask<Fn extends AnyFpFn, A, B> = ReturnType<Fn> extends TE.TaskEither<any, any>
  ? A : B;
type LeftOfReturn<Fn extends AnyFpFn> = ReturnType<Fn> extends E.Either<infer U, any> ? U : never;
type RightOfReturn<Fn extends AnyFpFn> = ReturnType<Fn> extends E.Either<any, infer U> ? U : never;
type TaskLeftOfReturn<Fn extends AnyFpFn> = ReturnType<Fn> extends TE.TaskEither<infer U, any>
  ? U : never;
type TaskRightOfReturn<Fn extends AnyFpFn> = ReturnType<Fn> extends TE.TaskEither<any, infer U>
  ? U : never;

type WrappedFnReturnType<Fn extends AnyFpFn> = IfReturnsTask<
  Fn,
  (TE.TaskEither<FunctionUnavailableError | TaskLeftOfReturn<Fn>, TaskRightOfReturn<Fn>>),
  (E.Either<FunctionUnavailableError | LeftOfReturn<Fn>, RightOfReturn<Fn>>)
>;
type WrappedFn<Fn extends AnyFpFn> = (...args: Parameters<Fn>) => WrappedFnReturnType<Fn>;

export type SafeWrappedFp<
  Fn extends AnyFpFn,
  HasSupportCheck extends boolean,
  SupportsMapKeySchema extends string = never,
> =
  & WrappedFn<Fn>
  // This one is required in order to understand what exactly should be returned
  // from the function - TaskEither or Either. There is no other way to know it until the function
  // itself is called, but we need to perform some checks before calling it and return a valid
  // value based on the function return type.
  & IfReturnsTask<Fn, { task: true }, {}>
  & {
  /**
   * A signal returning `true` if the function is available in the current environment and
   * conditions.
   *
   * To be more accurate, the method checks the following:
   * 1. The current environment is Telegram Mini Apps.
   * 2. The SDK package is initialized (if this requirement is specified).
   * 3. If passed, the `isSupported` signal returned true.
   * 4. If passed, the `isMounted` signal returned true.
   *
   * *You should use this function when possible because it provides must-have code security
   * mechanisms and makes a developer sure that he is using the package properly.*
   *
   * @returns True if the function is available in the current environment.
   * @example
   * if (backButton.show.isAvailable()) {
   *   backButton.show();
   * }
   */
    isAvailable: Computed<boolean>;
    /**
   * Calls the function only in case it is available.
   *
   * It uses the `isAvailable` internally to check if the function is available for call.
   * @example
   * backButton.show.ifAvailable();
   */
    ifAvailable(...args: Parameters<Fn>): O.Option<ReturnType<Fn>>;
  }
  & If<HasSupportCheck, {
  /**
   * The signal returning `true` if the function is supported by the Telegram client,
   * including some possible additional conditions.
   *
   * It is highly recommended to use this signal only in certain narrow cases when only the
   * function support check is required, but not its availability.
   *
   * This signal is not applying additional operations like checking if the current environment
   * is Mini Apps and the SDK is initialized.
   *
   * To check if the function is available for use, use the `isAvailable` signal.
   *
   * @returns True if this function is supported.
   * @see isAvailable
   * @example
   * if (backButton.show.isSupported()) {
   *   console.log('The method is supported');
   * }
   */
    isSupported: Computed<boolean>;
  }, {}>
  & If<IsNever<SupportsMapKeySchema>, {}, {
  /**
   * A map where the key is the function-specific option name and value is a signal indicating
   * if it is supported by the current environment.
   * @example
   * if (miniApp.setHeaderColor.isAvailable()) {
   *   if (miniApp.setHeaderColor.supports.rgb()) {
   *     miniApp.setHeaderColor('#ffaabb');
   *   } else {
   *     miniApp.setHeaderColor('bg_color');
   *   }
   * }
   */
    supports: Record<SupportsMapKeySchema, Computed<boolean>>;
  }>;

export interface WrapSafeOptions<Args extends any[]> {
  /**
   * Signal returning true if the owning component is mounted.
   */
  isMounted?: () => boolean;
  /**
   * Signal returning true if the owning component is mounting.
   */
  isMounting?: () => boolean;
  /**
   * Value determining if the function is supported by the current environment.
   */
  isSupported?: IsSupportedType;
  /**
   * A signal to retrieve the current Telegram Mini Apps version or the value itself.
   */
  isTma: MaybeAccessor<boolean>;
  /**
   * A map where the key is a method name with versioned parameters, and the value is a tuple
   * containing the method and parameter names. The third tuple value is a function accepting
   * the wrapped function arguments and returning true if support check must be applied.
   */
  supports?: Supports<Args>;
  /**
   * A signal to retrieve the current Telegram Mini Apps version or the value itself.
   */
  version?: MaybeAccessor<Version>;
}

export function wrapSafeFp<Fn extends AnyFn, O extends WrapSafeOptions<Parameters<Fn>>>(
  fn: Fn,
  options: O,
): SafeWrappedFp<
  Fn,
  O extends { isSupported: any } ? true : false,
  O extends { supports: Record<string, any> } ? keyof O['supports'] & string : never
> {
  const version = computed(() => access(options.version) || '100');
  const isTma = computed(() => access(options.isTma));

  // Simplify the isSupported value to work with an array of validators or a single object.
  const { isSupported: optionsIsSupported } = options;
  const isSupportedSimplified = optionsIsSupported
    ? typeof optionsIsSupported === 'object'
      ? optionsIsSupported
      : { every: [optionsIsSupported] }
    : undefined;

  /**
   * @param optionName - target option.
   * @returns True if specified option is supported.
   */
  const isOptionSupported = (optionName: string): boolean => {
    if (!options.supports) {
      return true;
    }
    const optionSettings = options.supports[optionName];
    return supports(optionSettings.method, optionSettings.param, version());
  };

  /**
   * @returns All found errors according to the isSupported variable value.
   */
  const calculateSupportError = (): string | undefined => {
    // isSupported was not specified. In this case, we assume that the function has no
    // dependencies and is always supported.
    if (!isSupportedSimplified) {
      return;
    }
    const [mode, requirements] = 'every' in isSupportedSimplified
      ? ['every', isSupportedSimplified.every] as const
      : ['some', isSupportedSimplified.some] as const;

    for (let i = 0; i < requirements.length; i++) {
      const requirement = requirements[i];
      const error = typeof requirement === 'function'
        ? requirement()
        : supports(requirement, version())
          ? undefined
          : `it is unsupported in Mini Apps version ${version()}`;
      // Return only if there was an error and all requirements must be satisfied, or
      // this was the last one requirement (when some of the requirements must be met).
      if (error && (mode === 'every' || i === requirements.length - 1)) {
        return error;
      }
    }
  };

  /**
   * @returns An error related to supports.<name> check.
   */
  const calculateOptionSupportError = (
    ...args: Parameters<Fn>
  ): string | undefined => {
    for (const k in options.supports) {
      if (options.supports[k].shouldCheck(...args) && !isOptionSupported(k)) {
        return `option ${k} is not supported in Mini Apps version ${version()}`;
      }
    }
  };

  let supportsMap: Record<string, Computed<boolean>> | undefined;
  if (options.supports) {
    supportsMap = {};
    for (const option in options.supports) {
      supportsMap[option] = computed(() => isOptionSupported(option));
    }
  }

  const isSupported = computed(() => !calculateSupportError());
  const isInitialized = computed(() => version() !== '0.0');
  const isMounted = computed(() => (options.isMounted ? options.isMounted() : true));
  const isAvailable = computed(
    () => isTma()
      && isInitialized()
      && isSupported()
      && isMounted(),
  );

  const wrapError = (message: string): WrappedFnReturnType<Fn> => {
    const err = new FunctionUnavailableError(message);
    return ('task' in options ? TE.left(err) : E.left(err)) as WrappedFnReturnType<Fn>;
  };

  return Object.assign(
    (...args: Parameters<Fn>): WrappedFnReturnType<Fn> => {
      const errMessagePrefix = 'Unable to call function:';
      if (!isTma()) {
        return wrapError(`${errMessagePrefix} it can't be called outside Mini Apps`);
      }
      if (!isInitialized()) {
        return wrapError(`${errMessagePrefix} the SDK was not initialized. Use the SDK init() function`);
      }
      const supportErr = calculateSupportError();
      if (supportErr) {
        return wrapError(`${errMessagePrefix} ${supportErr}`);
      }
      const supportsOptionErr = calculateOptionSupportError(...args);
      if (supportsOptionErr) {
        return wrapError(`${errMessagePrefix} ${supportsOptionErr}`);
      }
      if (!isMounted()) {
        const message = options.isMounting?.()
          ? 'mounting. Wait for the mount completion'
          : 'unmounted. Use the mount() method';
        return wrapError(`${errMessagePrefix} the component is ${message}`);
      }
      return fn(...args);
    },
    fn,
    {
      isAvailable,
      ifAvailable(...args: Parameters<Fn>): O.Option<ReturnType<Fn>> {
        return isAvailable() ? O.some(fn(...args) as ReturnType<Fn>) : O.none;
      },
    },
    isSupportedSimplified ? { isSupported } : {},
    supportsMap ? { supports: supportsMap } : {},
  );
}

export function createWrapSafeFp<O extends WrapSafeOptions<any>>(options: O) {
  return <Fn extends AnyFn>(fn: Fn): SafeWrappedFp<
    Fn,
    O extends { isSupported: any } ? true : false,
    O extends { supports: any } ? O['supports'] : never
  > => wrapSafeFp(fn, options);
}
