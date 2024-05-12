import type { FC, PropsWithChildren, ReactNode } from 'react';

import styles from './Page.module.css';

export interface PageProps extends PropsWithChildren {
  title: string;
  disclaimer?: ReactNode;
}

export const Page: FC<PageProps> = ({ title, children, disclaimer }) => (
  <div className={styles.root}>
    <h1>{title}</h1>
    {disclaimer && <div className={styles.disclaimer}>{disclaimer}</div>}
    {children}
  </div>
);
