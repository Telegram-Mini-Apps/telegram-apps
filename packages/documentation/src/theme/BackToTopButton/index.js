import React from 'react';
import BackToTopButton from '@theme-original/BackToTopButton';
import styles from './styles.module.scss';


export default function BackToTopButtonWrapper(props) {
  return (
    <div className={styles.root}>
      <BackToTopButton {...props}/>
    </div>
  );
}
