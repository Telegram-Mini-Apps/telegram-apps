import './Page.css';

/**
 * @param {string} title
 * @param {import('react').ReactNode} [children]
 * @param {import('react').ReactNode} [disclaimer]
 * @return {JSX.Element}
 */
export function Page({ title, children, disclaimer }) {
  return (
    <div className="page">
      <h1>{title}</h1>
      {disclaimer && <div className="page__disclaimer">{disclaimer}</div>}
      {children}
    </div>
  );
}
