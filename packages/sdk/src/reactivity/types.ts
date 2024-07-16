export type RemoveListenerFn = () => void;

export type ListenerFn<T> = (value: T) => void;

export type TrackReactiveUnitFn<T> = (fn: ListenerFn<T>) => RemoveListenerFn;

export type UntrackReactiveUnitFn<T> = (fn: ListenerFn<T>) => void;