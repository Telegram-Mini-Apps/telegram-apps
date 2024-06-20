import type { Component, JSX, ParentProps } from 'solid-js';

import './Page.css';

export interface PageProps extends ParentProps {
  title: string;
  disclaimer?: JSX.Element;
}

export const Page: Component<PageProps> = (props) => {
  return (
    <div class="page">
      <h1>{props.title}</h1>
      {props.disclaimer && <div class="page__disclaimer">{props.disclaimer}</div>}
      {props.children}
    </div>
  );
};
