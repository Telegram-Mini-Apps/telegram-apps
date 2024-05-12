import { isRGB } from '@tma.js/sdk-react';

import { RGB } from '@/components/RGB/RGB.jsx';

import './DisplayData.css';

/**
 * @typedef {object} DisplayDataRow
 * @property {string} title
 * @property {string | boolean | import('react').ReactNode | import('@tma.js/sdk-react').RGB} [value]
 */

/**
 * @param {DisplayDataRow[]} rows - list of rows to be displayed.
 * @return {JSX.Element}
 */
export function DisplayData({ rows }) {
  return (
    <div>
      {rows.map(({ title, value }, idx) => {
        let valueNode;

        if (value === undefined) {
          valueNode = <i>empty</i>;
        } else if (typeof value === 'string' && isRGB(value)) {
          valueNode = <RGB color={value} />;
        } else if (typeof value === 'boolean') {
          valueNode = value ? '✔️' : '❌';
        } else {
          valueNode = value;
        }

        return (
          <div className="display-data__line" key={idx}>
            <span className="display-data__line-title">{title}</span>
            <span className="display-data__line-value">{valueNode}</span>
          </div>
        );
      })}
    </div>
  );
}
