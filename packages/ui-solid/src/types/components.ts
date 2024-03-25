import type { Component, JSXElement } from 'solid-js';

export type ComponentSlot<P = {}> = JSXElement | Component<P>;
