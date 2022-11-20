import {
  isDesktop,
  Platform,
  Popup,
  PopupProps,
  ThemeParams,
  Viewport, ViewportProps,
} from '../components';
import {Bridge} from 'twa-bridge';
import {
  extractThemeFromJson,
  ThemeParams as TwaThemeParams,
} from 'twa-theme-params';

/**
 * Initializes ThemeParams instance.
 * @param bridge - Bridge instance.
 * @param themeParams - theme parameters.
 */
export function initTheme(bridge: Bridge, themeParams: TwaThemeParams): ThemeParams {
  // Create ThemeParams instance.
  const theme = new ThemeParams(themeParams);

  // Track external theme changes.
  bridge.on('theme_changed', ({theme_params}) => {
    theme.update(extractThemeFromJson(theme_params));
  });

  return theme;
}

/**
 * Initializes Viewport instance.
 * @param bridge - Bridge instance.
 * @param platform - platform name.
 * @param props - viewport props.
 */
export async function initViewport(
  bridge: Bridge,
  platform: Platform,
  props: ViewportProps
): Promise<Viewport> {
  // Get current viewport information.
  const {height, isStateStable, width, isExpanded} = isDesktop(platform)
    // In desktop version Viewport.request() will not work. See its
    // implementation.
    ? {
      width: window.innerWidth,
      height: window.innerHeight,
      isStateStable: true,
      isExpanded: true,
    }
    : await Viewport.request(bridge);

  // Create Viewport instance.
  const viewport = new Viewport({
    height,
    width,
    isExpanded,
    stableHeight: isStateStable ? height : 0,
    ...props,
    bridge,
  });

  // Listen to viewport change event.
  bridge.on('viewport_changed', payload => {
    const {height, is_state_stable, width, is_expanded} = payload;
    viewport.update({
      height,
      width,
      isStateStable: is_state_stable,
      isExpanded: is_expanded,
    });
  });

  return viewport;
}

/**
 * Initializes Popup instance.
 * @param bridge - Bridge instance.
 * @param props - Popup properties.
 */
export function initPopup(bridge: Bridge, props: PopupProps): Popup {
  const popup = new Popup({...props, bridge});

  // Track global popup close event.
  bridge.on('popup_closed', () => popup.hide());

  return popup;
}