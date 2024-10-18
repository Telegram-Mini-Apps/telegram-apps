import { TonConnectUI, type TonConnectOptions } from '@tonconnect/ui';
import { type App, type InjectionKey } from 'vue';

export const TonConnectInjectionKey: InjectionKey<TonConnectUI> = Symbol('tonconnect');

export default {
    install(app: App, options: TonConnectOptions) {
        app.provide(TonConnectInjectionKey, new TonConnectUI(options));
    },
};
