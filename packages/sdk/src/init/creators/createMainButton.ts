import type { RGB } from '@tma.js/colors';
import type { PostEvent } from '@tma.js/bridge';

import { MainButton } from '../../components/index.js';

import { getStorageValue, saveStorageValue } from '../../storage.js';

/**
 * Creates MainButton instance using last locally saved data also saving each state in
 * the storage.
 * @param backgroundColor - background color.
 * @param textColor - text color.
 * @param postEvent - Bridge postEvent function
 */
export function createMainButton(
  backgroundColor: RGB,
  textColor: RGB,
  postEvent: PostEvent,
): MainButton {
  const {
    backgroundColor: stateBackgroundColor = backgroundColor,
    isEnabled = false,
    isVisible = false,
    isProgressVisible = false,
    textColor: stateTextColor = textColor,
    text = '',
  } = getStorageValue('main-button') || {};

  const component = new MainButton(
    stateBackgroundColor,
    isEnabled,
    isVisible,
    isProgressVisible,
    text,
    stateTextColor,
    postEvent,
  );

  const saveState = () => saveStorageValue('main-button', {
    backgroundColor: component.backgroundColor,
    isEnabled: component.isEnabled,
    isVisible: component.isVisible,
    isProgressVisible: component.isProgressVisible,
    text: component.text,
    textColor: component.textColor,
  });

  component.on('backgroundColorChanged', saveState);
  component.on('isEnabledChanged', saveState);
  component.on('isVisibleChanged', saveState);
  component.on('isProgressVisibleChanged', saveState);
  component.on('textColorChanged', saveState);
  component.on('textChanged', saveState);

  return component;
}
