import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import ARTION_LOGO_URL from '../assets/svgs/logo_blue.svg';

// eslint-disable-next-line no-undef
const isMainnet = process.env.REACT_APP_ENV === 'MAINNET';

export const injected = new InjectedConnector({
  supportedChainIds: isMainnet
    ? [
        250, // fantom
      ]
    : [
        4002, // fantom testnet
      ],
});

export const walletlink = new WalletLinkConnector({
  url: 'https://rpc.ftm.tools',
  appName: 'Artion',
  appLogoUrl: ARTION_LOGO_URL,
});
