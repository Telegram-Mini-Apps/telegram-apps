'use client';

import { useRouter } from 'next/navigation';
import { backButton } from '@telegram-apps/sdk-react';
import { PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const router = useRouter();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        router.back();
      });
    }
    backButton.hide();
  }, [back, router]);

  return <>{children}</>;
}