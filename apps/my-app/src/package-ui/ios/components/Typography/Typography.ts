export type TypographyVariant =
  | 'caption2'
  | 'caption1'
  | 'footnote'
  | 'subheadline'
  | 'callout'
  | 'body'
  | 'headline'
  | 'title3'
  | 'title2'
  | 'title1'
  | 'largeTitle'

export interface TypographyProps {
  /**
   * @default 'body'.
   */
  variant?: TypographyVariant;
}

export function Typography() {

}