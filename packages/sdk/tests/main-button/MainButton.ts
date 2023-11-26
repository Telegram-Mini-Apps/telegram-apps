import { describe, expect, it, vi } from 'vitest';

import { MainButton } from '~/main-button/index.js';

describe('disable', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_active" property equal to false', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.disable();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', false);
  });

  it('should emit "change:isEnabled" event with false value', () => {
    const listener = vi.fn();
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: true,
    });

    mainButton.on('change:isEnabled', listener);
    mainButton.disable();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('enable', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_active" property equal to true', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.enable();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_active', true);
  });

  it('should emit "change:isEnabled" event with true value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:isEnabled', listener);
    mainButton.enable();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('hide', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_visible" property equal to false', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: true,
      isEnabled: false,
    });

    mainButton.hide();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', false);
  });

  it('should emit "change:isVisible" event with false value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: true,
      isEnabled: false,
    });

    mainButton.on('change:isVisible', listener);
    mainButton.hide();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('hideLoader', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_progress_visible" property equal to false', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: true,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.hideLoader();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', false);
  });

  it('should emit "change:isLoaderVisible" event with false value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: true,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:isLoaderVisible', listener);
    mainButton.hideLoader();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('show', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_visible" property equal to true', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.show();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_visible', true);
  });

  it('should emit "change:isVisible" event with true value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:isVisible', listener);
    mainButton.show();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('showLoader', () => {
  it('should call "web_app_setup_main_button" method with parameter where "is_progress_visible" property equal to true', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.showLoader();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('is_progress_visible', true);
  });

  it('should emit "change:isLoaderVisible" event with true value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:isLoaderVisible', listener);
    mainButton.showLoader();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('setText', () => {
  it('should call "web_app_setup_main_button" method with parameter where "text" property equal to specified value', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.setText('WOW');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('text', 'WOW');
  });

  it('should emit "change:text" event with specified value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:text', listener);
    mainButton.setText('Punch');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('Punch');
  });
});

describe('setTextColor', () => {
  it('should call "web_app_setup_main_button" method with parameter where "text_color" property equal to specified value', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.setTextColor('#ffaacc');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('text_color', '#ffaacc');
  });

  it('should emit "change:textColor" event with specified value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:textColor', listener);
    mainButton.setTextColor('#aaaaaa');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('#aaaaaa');
  });
});

describe('setColor', () => {
  it('should call "web_app_setup_main_button" method with parameter where "color" property equal to specified value', () => {
    const postEvent = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent,
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.setBackgroundColor('#ffaacc');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent.mock.calls[0][0]).toBe('web_app_setup_main_button');
    expect(postEvent.mock.calls[0][1]).toHaveProperty('color', '#ffaacc');
  });

  it('should emit "change:backgroundColor" event with specified value', () => {
    const listener = vi.fn();
    const mainButton = new MainButton({
      text: 'Test',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      postEvent: vi.fn(),
      isLoaderVisible: false,
      isVisible: false,
      isEnabled: false,
    });

    mainButton.on('change:backgroundColor', listener);
    mainButton.setBackgroundColor('#aaaaaa');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('#aaaaaa');
  });
});
