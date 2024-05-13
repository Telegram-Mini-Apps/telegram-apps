import { For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Link } from '@/components/Link/Link.jsx';
import { Page } from '@/components/Page/Page.jsx';
import { routes } from '@/navigation/routes.jsx';

import './IndexPage.css';

export function IndexPage() {
  return (
    <Page title="Home Page">
      <p>
        This page is a home page in this boilerplate. You can use the links below to visit other
        pages with their own functionality.
      </p>
      <ul class="index-page__links">
        <For each={routes}>
          {(route) => (
            <Show when={route.title}>
              <li class="index-page__link-item">
                <Link class="index-page__link" href={route.path}>
                  <Show when={route.Icon}>
                    {(Icon) => (
                      <i class="index-page__link-icon">
                        <Dynamic component={Icon()}/>
                      </i>
                    )}
                  </Show>
                  {route.title}
                </Link>
              </li>
            </Show>
          )}
        </For>
      </ul>
    </Page>
  );
}
