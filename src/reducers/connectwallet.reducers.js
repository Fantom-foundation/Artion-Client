import { WalletConnectConstants } from '../constants/walletconnect.constants';

export function ConnectWallet(
  state = { isConnected: false, chainId: 0 },
  action
) {
  switch (action.type) {
    case WalletConnectConstants.WALLETCONNECTED: {
      return {
        ...state,
        isConnected: true,
        chainId: action.chainId,
      };
    }
    case WalletConnectConstants.WALLETDISCONNECTED: {
      return {
        ...state,
        isConnected: false,
        chainId: 0,
      };
    }
    case WalletConnectConstants.CHAINIDCHANGED: {
      return {
        ...state,
        chainId: action.chainId,
      };
    }
    default: {
      return state;
    }
  }
}
