import React from 'react';
import Admonition from '@theme-original/Admonition';
import styles from './styles.module.scss';

export default function AdmonitionWrapper(props) {
  return (
    <div className={styles.root}>
      <Admonition {...props}/>
    </div>
  );
}
