import { WalletConnectConstants } from '../constants/walletconnect.constants';

const WalletConnectActions = {
  connectWallet,
  disconnectWallet,
  changeChainId,
};

function connectWallet(chainId) {
  return dispatch => {
    dispatch(_connectWallet(chainId));
  };
}

const _connectWallet = chainId => {
  return {
    type: WalletConnectConstants.WALLETCONNECTED,
    chainId: chainId,
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

function changeChainId(chainId) {
  return dispatch => {
    dispatch(_changeChainId(chainId));
  };
}

const _changeChainId = chainId => {
  return {
    type: WalletConnectConstants.CHAINIDCHANGED,
    chainId: chainId,
  };
};

export default WalletConnectActions;
