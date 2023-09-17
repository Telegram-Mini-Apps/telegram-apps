import React from 'react';

interface Props {
  pkg: string;
}

/**
 * Provides meta information about NPM package.
 * @param pkg
 * @constructor
 */
export default function LibraryBadges({pkg}: Props) {
  return (
    <div style={{marginBottom: 10}}>
      <a href={`https://npmjs.com/package/${pkg}`}>
        <img alt={'npm'} src={`https://img.shields.io/npm/v/${pkg}?logo=npm`}/>
      </a>

      <img
        alt={'size'}
        style={{marginLeft: 10}}
        src={`https://img.shields.io/bundlephobia/minzip/${pkg}`}
      />
    </div>
  );
}