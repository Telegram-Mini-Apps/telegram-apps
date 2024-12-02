import { useNavigate } from 'react-router-dom';
import { backButton, useSignal, viewport } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';

export function Page({children, back = true}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate();

  const inset = useSignal(viewport.safeAreaInsets);
  const contentInset = useSignal(viewport.contentSafeAreaInsets);

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
    backButton.hide();
  }, [back]);

  return <div style={{
    paddingTop: inset.top + contentInset.top,
    paddingLeft: inset.left,
    paddingRight: inset.right,
  }}>
    {children}
  </div>;
}