import { Computed, computed, signal, Signal } from '@telegram-apps/signals';
import { off, on, postEvent as defaultPostEvent, PostEvent } from '@telegram-apps/bridge';

import { MemoryNavigator } from '@/MemoryNavigator/MemoryNavigator.js';
import type { AnyHistoryItem } from '@/MemoryNavigator/types.js';

export interface BBOptions {
  /**
   * Custom behavior on the back button press.
   *
   * Note that this method will only be called in case the navigator was attached via
   * the `attach()` method.
   * @default The navigator's `back()` method will be called.
   */
  onPressed?(this: void): void;
  /**
   * Function to update the back button visibility state.
   * @default The bridge `postEvent` function will be called.
   */
  setVisibility?(this: void, visible: boolean): void;
}

export interface ConOptions {
  /**
   * Function to call Mini Apps methods.
   * @default The `postEvent` function from @telegram-apps/bridge.
   */
  postEvent?: PostEvent;
  /**
   * Options related to the back button.
   *
   * Using these options, a developer could disable some predefined behavior related to the back
   * button.
   */
  bb?: Partial<BBOptions>;
}

export class AttachableMemoryNavigator<Params> extends MemoryNavigator<Params> {
  private readonly _attached: Signal<boolean>;
  private readonly bb: Required<BBOptions>;

  /**
   *
   * @param history
   * @param cursor
   * @param options
   * @throws {} Errors from the MemoryNavigator constructor.
   * @see MemoryNavigator
   */
  constructor(
    history: AnyHistoryItem<Params>[],
    cursor: number,
    options?: ConOptions,
  ) {
    super(history, cursor);

    options ||= {};
    const bb = options.bb || {};

    const attachedSignal = signal(false);
    this._attached = attachedSignal;
    this.attached = computed(attachedSignal);
    this.bb = {
      onPressed: bb.onPressed || this.back.bind(this),
      setVisibility: bb.setVisibility || ((visible) => {
        (options.postEvent || defaultPostEvent)('web_app_setup_back_button', { is_visible: visible });
      }),
    };
  }

  /**
   * True if the current navigator is currently attached.
   */
  readonly attached: Computed<boolean>;

  /**
   * Allows this navigator to control the back button visibility state.
   * It also tracks the back button clicks and calls the corresponding callback.
   */
  attach(): void {
    if (!this._attached()) {
      on('back_button_pressed', this.bb.onPressed);
      this.sync();
      this._cursor.sub(this.sync);
      this._attached.set(true);
    }
  }

  /**
   * Prevents the current navigator from working with the back button.
   */
  detach(): void {
    off('back_button_pressed', this.bb.onPressed);
    this._cursor.unsub(this.sync);
    this._attached.set(false);
  }

  /**
   * Actualizes the back button visibility state.
   */
  private sync = (): void => {
    this.bb.setVisibility(this.hasPrev());
  };
}