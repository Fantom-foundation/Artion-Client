import { WalletConnectConstants } from '../constants/walletconnect.constants';

export function ConnectWallet(
  state = { isConnected: false, authToken: null, isModerator: false },
  action
) {
  switch (action.type) {
    case WalletConnectConstants.WALLETCONNECTED: {
      return {
        ...state,
        isConnected: true,
        authToken: action.token,
        isModerator: action.isModerator,
      };
    }
    case WalletConnectConstants.WALLETDISCONNECTED: {
      return {
        ...state,
        isConnected: false,
        authToken: null,
        isModerator: false,
      };
    }
    default: {
      return state;
    }
  }
}
