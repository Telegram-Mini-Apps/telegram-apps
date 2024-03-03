import type { Component } from 'solid-js';

import { withConfig } from '../../providers/index.js';

import type { LoaderProps } from './Loader.types.js';
import { LoaderView } from './LoaderView.js';

export const Loader: Component<LoaderProps> = withConfig(LoaderView);
