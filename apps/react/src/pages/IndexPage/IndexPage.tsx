import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page/Page.tsx';
import { routes } from '@/navigation/routes.tsx';

import './IndexPage.css';

export const IndexPage: FC = () => (
  <Page title="Home Page">
    <p>
      This page is a home page in this boilerplate. You can use the links below to visit other
      pages with their own functionality.
    </p>
    <ul className="index-page__links">
      {routes.map(({ path, title, icon }) => title && (
        <li className="index-page__link-item" key={path}>
          <Link className="index-page__link" to={path}>
            {icon && (
              <i className="index-page__link-icon">
                {icon}
              </i>
            )}
            {title}
          </Link>
        </li>
      ))}
    </ul>
  </Page>
);
