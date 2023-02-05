import React from 'react';
import Sidebar from '@theme-original/DocPage/Layout/Sidebar';
import styles from './styles.module.scss';
import Logo from './logo.svg';

export default function SidebarWrapper(props) {
  return (
    <div className={styles.root}>
      <div className={styles.sticky}>
        <div className={styles.logoWrapper}>
          <Logo/>
          <span className={styles.logoText}>Web apps</span>
        </div>
        <Sidebar {...props} />
      </div>
    </div>
  );
}
