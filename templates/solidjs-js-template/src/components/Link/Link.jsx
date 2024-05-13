import { A } from '@solidjs/router';
import { classNames, useUtils } from '@tma.js/sdk-solid';

import './Link.css';

/**
 * @param {import('@solidjs/router').AnchorProps} props
 * @return {import('solid-js').JSXElement}
 */
export function Link(props) {
  const utils = useUtils();

  /**
   * @param {MouseEvent} e
   */
  const onClick = (e) => {
    // Compute if target path is external. In this case we would like to open link using
    // TMA method.
    const targetUrl = new URL(props.href, window.location.toString());
    const currentUrl = new URL(window.location.toString());
    const isExternal = targetUrl.protocol !== currentUrl.protocol
      || targetUrl.host !== currentUrl.host;

    if (isExternal) {
      e.preventDefault();
      return utils().openLink(targetUrl.toString());
    }
  };

  return (
    <A
      {...props}
      onClick={onClick}
      class={classNames(props.class, 'link')}
    />
  );
}
