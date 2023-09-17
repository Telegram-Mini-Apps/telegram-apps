import React from 'react';
import Link from '@docusaurus/Link';

interface Props {
  methods: string[];
}

export default function ComponentMethodsSupport({ methods }: Props) {
  return (
    <>
      <p>
        Methods available for the <Link href={'../about#methods-support'}>support check</Link>:
      </p>
      <ul>
        {methods.map((method, idx) => (
          <li key={idx}>
            <code>{method}</code>
          </li>
        ))}
      </ul>
    </>
  )
}