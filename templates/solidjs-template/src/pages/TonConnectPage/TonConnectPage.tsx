import { Show, type Component } from 'solid-js';

import { DisplayData } from '@/components/DisplayData/DisplayData.js';
import { Link } from '@/components/Link/Link.js';
import { Page } from '@/components/Page/Page.js';
import { TonConnectButton } from '@/tonconnect/TonConnectButton.js';
import { useTonWallet } from '@/tonconnect/useTonWallet.js';

import './TonConnectPage.css';

export const TonConnectPage: Component = () => {
  const wallet = useTonWallet();

  return (
    <Page title="TON Connect">
      <Show
        when={wallet()}
        fallback={
          <p>
            To display the data related to the TON Connect, it is required to connect your wallet.
          </p>
        }
      >
        {(walletBasic) => {
          const walletExtended = () => {
            const w = walletBasic();
            return 'imageUrl' in w ? w : null;
          };
          const account = () => walletBasic().account;

          return (
            <>
              <Show when={walletExtended()}>
                {(w) => (
                  <div class="ton-connect-page__provider">
                    <img
                      class="ton-connect-page__provider-image"
                      alt="Provider logo"
                      src={w().imageUrl}
                      width={60}
                      height={60}
                    />
                    <div class="ton-connect-page__provider-meta">
                      <p class="ton-connect-page__provider-wallet-name">
                        {w().name}&nbsp;
                        <span class="ton-connect-page__provider-app-name">
                          ({w().appName})
                        </span>
                      </p>
                      <Link href={w().aboutUrl}>
                        About connected wallet
                      </Link>
                    </div>
                  </div>
                )}
              </Show>
              <DisplayData
                rows={[
                  { title: 'Address', value: account().address },
                  { title: 'Chain', value: account().chain },
                  { title: 'Public Key', value: account().publicKey },
                ]}
              />
            </>
          );
        }}
      </Show>
      <div class="ton-connect-page__button-container">
        <TonConnectButton/>
      </div>
    </Page>
  );
};
