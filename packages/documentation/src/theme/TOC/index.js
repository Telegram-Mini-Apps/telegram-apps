import React from 'react';
import TOC from '@theme-original/TOC';
import clsx from 'clsx';
import styles from './styles.module.scss';

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} className={clsx(props.className, styles.root)} />
    </>
  );
}
