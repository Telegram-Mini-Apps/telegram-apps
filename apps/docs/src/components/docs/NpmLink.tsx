import React from 'react';

interface Props {
  pkg: string;
}

/**
 * Represents link to npm package.
 * @param pkg
 * @constructor
 */
export default function NpmLink({pkg}: Props) {
  return (
    <a href={`https://npmjs.com/package/${pkg}`}>
      <code>
        {pkg}
      </code>
    </a>
  );
}