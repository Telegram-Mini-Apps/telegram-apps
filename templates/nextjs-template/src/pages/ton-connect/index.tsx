import { useUtils } from '@tma.js/sdk-react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import type { FC, ReactNode } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page/Page';

import styles from './styles.module.css';

export default function TONConnectPage() {
  const wallet = useTonWallet();
  const utils = useUtils();
  let content: ReactNode;

  if (wallet) {
    const {
      chain,
      publicKey,
      address,
    } = wallet.account;
    content = (
      <>
        {'imageUrl' in wallet && (
          <div className={styles.provider}>
            <img
              className={styles.providerImage}
              alt="Provider logo"
              src={wallet.imageUrl}
              width={60}
              height={60}
            />
            <div className={styles.providerMeta}>
              <p className={styles.providerWalletName}>
                {wallet.name}
                &nbsp;
                <span className={styles.providerAppName}>
                  (
                  {wallet.appName}
                  )
                </span>
              </p>
              <Link
                href={wallet.aboutUrl}
                onClick={(e) => {
                  e.preventDefault();
                  utils.openLink(wallet.aboutUrl);
                }}
              >
                About connected wallet
              </Link>
            </div>
          </div>
        )}
        <DisplayData
          rows={[
            { title: 'Address', value: address },
            { title: 'Chain', value: chain },
            { title: 'Public Key', value: publicKey },
          ]}
        />
      </>
    );
  } else {
    content = (
      <p>
        To display the data related to the TON Connect, it is required to connect your wallet.
      </p>
    );
  }

  return (
    <Page title="TON Connect">
      {content}
      <div className={styles.buttonContainer}>
        <TonConnectButton />
      </div>
    </Page>
  );
};
