import { useNavigate } from 'react-router-dom';
import { backButton, safeArea, useSignal } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';

export function Page({children, back = true}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate();

  const inset = useSignal(safeArea.inset);
  const contentInset = useSignal(safeArea.contentInset);

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
    paddingTop: contentInset.top,
    paddingLeft: inset.left,
    paddingRight: inset.right,
  }}>
    {children}
  </div>;
}