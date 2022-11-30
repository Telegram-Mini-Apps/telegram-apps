import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

interface Props {
  pkg: string;
}

/**
 * Represents component which provides information about how to install
 * specified package via 3 package managers.
 * @param pkg
 * @constructor
 */
export default function NpmInstall({pkg}: Props) {
  return (
    <Tabs>
      <TabItem value="npm" label="npm" default>
        <CodeBlock language={'bash'}>
          npm i {pkg}
        </CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language={'bash'}>
          yarn add {pkg}
        </CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language={'bash'}>
          pnpm i {pkg}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}