import React from 'react';
import ColorModeToggle from '@theme-original/Navbar/ColorModeToggle';
import styles from './styles.module.scss';
import clsx from 'clsx';

export default function ColorModeToggleWrapper(props) {
  return (
    <>
      <ColorModeToggle {...props} className={clsx(props.className, styles.root)}/>
    </>
  );
}
