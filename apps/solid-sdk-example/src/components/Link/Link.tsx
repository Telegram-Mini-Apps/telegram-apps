import { Link as RouterLink, LinkProps } from '@solidjs/router';

import styles from './styles.module.css';

export function Link(props: LinkProps) {
  return <RouterLink {...props} classList={{ [props.class || '']: true, [styles.root]: true }}/>;
}