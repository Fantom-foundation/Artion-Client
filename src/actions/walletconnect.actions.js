import { WalletConnectConstants } from '../constants/walletconnect.constants';

const WalletConnectActions = {
  connectWallet,
  disconnectWallet,
};

function connectWallet(authToken) {
  return dispatch => {
    dispatch(_connectWallet(authToken));
  };
}

const _connectWallet = authToken => {
  return {
    type: WalletConnectConstants.WALLETCONNECTED,
    token: authToken,
  };
};

function disconnectWallet() {
  return dispatch => {
    dispatch(_disconnectWallet());
  };
}

const _disconnectWallet = () => {
  return {
    type: WalletConnectConstants.WALLETDISCONNECTED,
  };
};

export default WalletConnectActions;
