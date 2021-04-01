import { WalletConnectConstants } from '../constants/walletconnect.constants';

export function ConnectWallet(
  state = { isConnected: false, chainId: 0, address: '', authToken: null },
  action
) {
  switch (action.type) {
    case WalletConnectConstants.WALLETCONNECTED: {
      return {
        ...state,
        isConnected: true,
        chainId: action.chainId,
        address: action.address,
        authToken: action.token,
      };
    }
    case WalletConnectConstants.WALLETDISCONNECTED: {
      return {
        ...state,
        isConnected: false,
        chainId: 0,
        address: '',
        authToken: null,
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
