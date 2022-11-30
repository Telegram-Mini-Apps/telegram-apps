import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

interface Props {
  pkg: string;
}

/**
 * Provides meta information about NPM package.
 * @param pkg
 * @constructor
 */
export default function NpmMeta({pkg}: Props) {
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