import { WalletConnectConstants } from '../constants/walletconnect.constants';

const WalletConnectActions = {
  connectWallet,
  disconnectWallet,
};

function connectWallet(authToken, isModerator) {
  return dispatch => {
    dispatch(_connectWallet(authToken, isModerator));
  };
}

const _connectWallet = (authToken, isModerator) => {
  return {
    type: WalletConnectConstants.WALLETCONNECTED,
    token: authToken,
    isModerator,
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
