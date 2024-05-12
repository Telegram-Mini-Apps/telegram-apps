import { Link } from '@/components/Link/Link.jsx';
import { Page } from '@/components/Page/Page.jsx';
import { routes } from '@/navigation/routes.jsx';

import './IndexPage.css';

/**
 * @returns {JSX.Element}
 */
export function IndexPage() {
  return (
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
}
