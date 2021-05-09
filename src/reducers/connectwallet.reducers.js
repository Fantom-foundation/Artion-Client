import { WalletConnectConstants } from '../constants/walletconnect.constants';

export function ConnectWallet(
  state = { isConnected: false, authToken: null },
  action
) {
  switch (action.type) {
    case WalletConnectConstants.WALLETCONNECTED: {
      return {
        ...state,
        isConnected: true,
        authToken: action.token,
      };
    }
    case WalletConnectConstants.WALLETDISCONNECTED: {
      return {
        ...state,
        isConnected: false,
        authToken: null,
      };
    }
    default: {
      return state;
    }
  }
}
