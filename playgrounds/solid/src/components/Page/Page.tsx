import {
  onMount,
  type Component,
  type JSX,
  type ParentProps, onCleanup, createMemo,
} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { backButton } from '@telegram-apps/sdk-solid';

import './Page.css';

export interface PageProps extends ParentProps {
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean;
  title: string;
  disclaimer?: JSX.Element;
}

export const Page: Component<PageProps> = (props) => {
  const navigate = useNavigate();
  const back = createMemo(() => typeof props.back === 'undefined' || props.back);

  onMount(() => {
    if (back()) {
      backButton.show();
      onCleanup(
        backButton.onClick(() => {
          navigate(-1);
        }),
      );
    } else {
      backButton.hide();
    }
  });

  return (
    <div class="page">
      <h1>{props.title}</h1>
      {props.disclaimer && <div class="page__disclaimer">{props.disclaimer}</div>}
      {props.children}
    </div>
  );
};
