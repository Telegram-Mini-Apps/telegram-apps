import React from 'react';
import Link from '@docusaurus/Link';

type EventName = string;
type Declaration = string;

interface Props {
  events: Record<EventName, Declaration>;
}

export default function ComponentSupportedEvents({ events }: Props) {
  return (
    <>
      <p>
        Events available for the <Link href={'../about#events'}>listening</Link>:
      </p>
      <ul>
        {Object.entries(events).map(([event, declaration], idx) => (
          <li key={idx}>
            <code>{event}: {declaration}</code>
          </li>
        ))}
      </ul>
    </>
  )
}