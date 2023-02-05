import React from 'react';
import Mobile from '@theme-original/DocItem/TOC/Mobile';
import styles from './styles.module.scss';

export default function MobileWrapper(props) {
  return (
    <div className={styles.root}>
      <Mobile {...props} />
    </div>
  );
}
