import { computed, type Computed, signal } from '@tma.js/signals';
import type { ThemeParams as ThemeParamsType, RGB } from '@tma.js/types';
import { snakeToKebab, eitherGet } from '@tma.js/toolkit';
import type { EventListener } from '@tma.js/bridge';
import type { Either } from 'fp-ts/Either';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type {
  SharedFeatureOptions,
  WithIsPageReload,
  WithStorage,
  WithVersion,
} from '@/features/mixins.js';
import { Stateful } from '@/composables/Stateful.js';
import type { ComponentStorage } from '@/component-storage.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';
import { CSSVarsBoundError } from '@/errors.js';
import { deleteCssVar, setCssVar } from '@/helpers/css-vars.js';
import { isColorDark } from '@/helpers/isColorDark.js';

export type ThemeParamsState = ThemeParamsType;

type RetrieveThemeParams<E> = () => Either<E, ThemeParamsType>;

export interface ThemeParamsOptions<Err> extends WithVersion,
  WithStorage<ComponentStorage<ThemeParamsState>>,
  WithIsPageReload,
  SharedFeatureOptions {
  /**
   * Removes a theme change listener.
   * @param listener - a listener to remove.
   */
  offThemeChanged: (listener: EventListener<'theme_changed'>) => void;
  /**
   * Adds a theme change listener.
   * @returns A function to remove listener.
   * @param listener - a listener to add.
   */
  onThemeChanged: (listener: EventListener<'theme_changed'>) => void;
  /**
   * Retrieves theme parameters from the current environment.
   */
  retrieveThemeParams: RetrieveThemeParams<Err>;
}

export interface ThemeParamsGetCssVarNameFn {
  /**
   * @param property - palette key.
   * @returns Computed complete CSS variable name.
   */
  (property: Extract<keyof ThemeParamsType, string>): string;
}

export class ThemeParams<Err> {
  constructor({
    retrieveThemeParams,
    onThemeChanged,
    offThemeChanged,
    version,
    isTma,
    storage,
    isPageReload,
  }: ThemeParamsOptions<Err>) {
    const stateful = new Stateful<ThemeParamsState>({
      initialState: {},
      onChange: storage.set,
    });
    const listener: EventListener<'theme_changed'> = event => {
      stateful.setState(event.theme_params);
    };
    const mountable = new Mountable({
      initialState() {
        return eitherGet(retrieveThemeParams());
      },
      isPageReload,
      onMounted(state) {
        stateful.setState(state);
        onThemeChanged(listener);
      },
      onUnmounted() {
        offThemeChanged(listener);
      },
      restoreState: storage.get,
    });

    const wrapOptions = { version, isTma };
    const wrapSafe = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: mountable.isMounted,
    });

    const fromState = <K extends keyof ThemeParamsType>(
      key: K,
    ): Computed<ThemeParamsType[K] | undefined> => {
      return computed(() => stateful.state()[key]);
    };

    // Colors.
    this.accentTextColor = fromState('accent_text_color');
    this.bgColor = fromState('bg_color');
    this.buttonColor = fromState('button_color');
    this.buttonTextColor = fromState('button_text_color');
    this.bottomBarBgColor = fromState('bottom_bar_bg_color');
    this.destructiveTextColor = fromState('destructive_text_color');
    this.headerBgColor = fromState('header_bg_color');
    this.hintColor = fromState('hint_color');
    this.linkColor = fromState('link_color');
    this.secondaryBgColor = fromState('secondary_bg_color');
    this.sectionBgColor = fromState('section_bg_color');
    this.sectionHeaderTextColor = fromState('section_header_text_color');
    this.sectionSeparatorColor = fromState('section_separator_color');
    this.subtitleTextColor = fromState('subtitle_text_color');
    this.textColor = fromState('text_color');

    // Other public signals.
    this.state = stateful.state;
    this.isMounted = mountable.isMounted;
    this.bindCssVars = wrapComplete(getCSSVarName => {
      if (this._isCssVarsBound()) {
        throw new CSSVarsBoundError();
      }
      getCSSVarName ||= prop => `--tg-theme-${snakeToKebab(prop)}`;

      const forEachEntry = (fn: (key: string, value: RGB) => void): void => {
        Object.entries(stateful.state()).forEach(([k, v]) => {
          v && fn(k, v);
        });
      };

      const actualize = (): void => {
        forEachEntry((k, v) => {
          setCssVar(getCSSVarName(k), v);
        });
      };

      actualize();
      stateful.state.sub(actualize);
      this._isCssVarsBound.set(true);

      return () => {
        forEachEntry(deleteCssVar);
        stateful.state.unsub(actualize);
        this._isCssVarsBound.set(false);
      };
    });

    this.mount = wrapSafe(bound(mountable, 'mount'));
    this.unmount = bound(mountable, 'unmount');
  }

  private readonly _isCssVarsBound = signal(false);

  //#region Colors.
  /**
   * @since v6.10
   */
  readonly accentTextColor: Computed<RGB | undefined>;

  readonly bgColor: Computed<RGB | undefined>;

  readonly buttonColor: Computed<RGB | undefined>;

  readonly buttonTextColor: Computed<RGB | undefined>;

  /**
   * @since v7.10
   */
  readonly bottomBarBgColor: Computed<RGB | undefined>;

  readonly destructiveTextColor: Computed<RGB | undefined>;

  /**
   * @since v6.10
   */
  readonly headerBgColor: Computed<RGB | undefined>;

  readonly hintColor: Computed<RGB | undefined>;

  readonly linkColor: Computed<RGB | undefined>;

  readonly secondaryBgColor: Computed<RGB | undefined>;

  /**
   * @since v6.10
   */
  readonly sectionBgColor: Computed<RGB | undefined>;

  /**
   * @since v6.10
   */
  readonly sectionHeaderTextColor: Computed<RGB | undefined>;

  /**
   * @since v7.6
   */
  readonly sectionSeparatorColor: Computed<RGB | undefined>;

  /**
   * @since v6.10
   */
  readonly subtitleTextColor: Computed<RGB | undefined>;

  readonly textColor: Computed<RGB | undefined>;
  //#endregion

  //#region Other public signals.

  /**
   * Complete component state.
   */
  readonly state: Computed<ThemeParamsType>;

  /**
   * True if CSS variables are currently bound.
   */
  readonly isCssVarsBound = computed(this._isCssVarsBound);

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * @returns True if the current color scheme is recognized as dark.
   * This value is calculated based on the current theme's background color.
   */
  readonly isDark = computed(() => {
    const color = this.bgColor();
    return !color || isColorDark(color);
  });

  //#endregion

  //#region Methods.

  /**
   * Creates CSS variables connected with the current theme parameters.
   *
   * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
   * {name} is a theme parameters key name converted from snake case to kebab case.
   *
   * Default variables:
   * - `--tg-theme-bg-color`
   * - `--tg-theme-secondary-text-color`
   *
   * Variables are being automatically updated if theme parameters were changed.
   *
   * @param getCSSVarName - function, returning complete CSS variable name for the specified
   * theme parameters key.
   * @returns Function to stop updating variables.
   * @throws {CSSVarsBoundError} CSS variables are already bound
   * @example Using custom CSS vars generator
   * themeParams.bindCssVars(key => `--my-prefix-${key}`);
   */
  readonly bindCssVars: SafeWrapped<
    (getCSSVarName?: ThemeParamsGetCssVarNameFn) => VoidFunction,
    false
  >;

  /**
   * Mounts the component restoring its state.
   */
  readonly mount: SafeWrapped<() => void, false>;

  /**
   * Unmounts the component.
   */
  readonly unmount: () => void;

  //#endregion
}
