import { createMemo } from 'solid-js';
import { mergeClassNames } from '@twa.js/utils';

import { Button, Typography, TableView, TableViewCell } from '../../../package-ui/index.js';

import styles from './styles.module.scss';

export function Empty() {
  const classes = createMemo(() => {
    return mergeClassNames(styles);
  });

  return (
    <div class={classes().root}>
      <TableView title="Applications">
        <TableViewCell title="Add application" clickable/>
      </TableView>
    </div>
  );
}