export interface ThemeParamsEvents {
  changed: () => void;
}

export type ThemeParamsEventName = keyof ThemeParamsEvents;

export type ThemeParamsEventListener<E extends ThemeParamsEventName> =
  ThemeParamsEvents[E];
