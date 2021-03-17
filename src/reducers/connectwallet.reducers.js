import { WalletConnectConstants } from '../constants/walletconnect.constants';

export function ConnectWallet(
  state = { isConnected: false, chainId: 0, address: '' },
  action
) {
  switch (action.type) {
    case WalletConnectConstants.WALLETCONNECTED: {
      return {
        ...state,
        isConnected: true,
        chainId: action.chainId,
        address: action.address,
      };
    }
    case WalletConnectConstants.WALLETDISCONNECTED: {
      return {
        ...state,
        isConnected: false,
        chainId: 0,
        address: '',
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
