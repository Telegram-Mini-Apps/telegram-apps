/* COMPONENTS */

// Badge
export { Badge } from '~/components/Badge/Badge.js';
export type {
  BadgeClassesProps,
  BadgeDefaults,
  BadgeElementKey,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
} from '~/components/Badge/Badge.types.js';

// Button
export { Button } from '~/components/Button/Button.js';
export type {
  ButtonClassesProps,
  ButtonDefaults,
  ButtonElementKey,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from '~/components/Button/Button.types.js';

// CircularProgress
export { CircularProgress } from '~/components/CircularProgress/CircularProgress.js';
export type {
  CircularProgressClassesProps,
  CircularProgressDefaults,
  CircularProgressElementKey,
  CircularProgressProps,
  CircularProgressSize,
} from '~/components/CircularProgress/CircularProgress.types.js';

// IconButton
export { IconButton } from '~/components/IconButton/IconButton.js';
export type {
  IconButtonClassesProps,
  IconButtonElementKey,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from '~/components/IconButton/IconButton.types.js';

// Loader
export { Loader } from '~/components/Loader/Loader.js';
export type {
  LoaderClassesProps,
  LoaderDefaults,
  LoaderElementKey,
  LoaderProps,
  LoaderSize,
} from '~/components/Loader/Loader.types.js';

// Progress
export { Progress } from '~/components/Progress/Progress.js';
export type {
  ProgressClassesProps,
  ProgressElementKey,
  ProgressProps,
} from '~/components/Progress/Progress.types.js';

// Quote
export { Quote } from '~/components/Quote/Quote.js';
export type {
  QuoteClassesProps,
  QuoteElementKey,
  QuoteProps,
} from '~/components/Quote/Quote.types.js';

// Ripples
export { Ripples } from '~/components/Ripples/Ripples.js';
export type {
  LayoutProps,
  PointerEventHandler,
  RippleData,
  RipplesClassesProps,
  RipplesComponentProps,
  RipplesCustomClassesProps,
  RipplesCustomProps,
  RipplesDefaults,
  RipplesElementKey,
  RipplesProps,
  TransitionEventHandler,
} from '~/components/Ripples/Ripples.types.js';

// Typography
export { Typography } from '~/components/Typography/Typography.js';
export type {
  TypographyClassesProps,
  TypographyComponentProps,
  TypographyCustomClassesProps,
  TypographyCustomProps,
  TypographyDefaults,
  TypographyElementKey,
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
} from '~/components/Typography/Typography.types.js';

/* PROVIDERS */

// ConfigProvider.
export type { Config } from '~/providers/ConfigProvider/ConfigProvider.context.js';
export { ConfigProvider } from '~/providers/ConfigProvider/ConfigProvider.js';

/* HOCs */
export { withConfig } from '~/hocs/withConfig.js';

/* Hooks */
export { useConfig } from '~/hooks/useConfig.js';

/* Styles */
export { styled } from '~/styles/styled.js';
export type {
  Classes,
  ClassesValue,
  ClassName,
  ClassNameFn,
  ClassNamesMap,
  ExtractPropsClasses,
  WithOptionalClasses,
} from '~/styles/types.js';

/* Types */
export type { ComponentSlot } from '~/types/components.js';
export type { JSXIntrinsicElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';
export type {
  ColorScheme,
  Platform,
  WithColorScheme,
  WithConfig,
  WithPlatform,
} from '~/types/known.js';
