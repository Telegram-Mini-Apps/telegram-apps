import './Page.css';

/**
 * @typedef PageProps
 * @property {String} title
 * @property {import('solid-js').JSXElement} [disclaimer]
 * @property {import('solid-js').JSXElement} [children]
 */

/**
 * @param {PageProps} props
 * @return {import('solid-js').JSXElement}
 */
export function Page(props) {
  return (
    <div class="page">
      <h1>{props.title}</h1>
      {props.disclaimer && <div class="page__disclaimer">{props.disclaimer}</div>}
      {props.children}
    </div>
  );
}
