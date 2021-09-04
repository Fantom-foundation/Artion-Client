import ModalConstants from '../constants/modal.constants';

const initialState = {
  accountModalVisible: false,
  wftmModalVisible: false,
  connectWalletModalVisible: false,
};

export function Modal(state = initialState, action) {
  switch (action.type) {
    case ModalConstants.SHOW_ACCOUNT_MODAL:
      return {
        ...state,
        accountModalVisible: true,
      };
    case ModalConstants.HIDE_ACCOUNT_MODAL:
      return {
        ...state,
        accountModalVisible: false,
      };
    case ModalConstants.SHOW_WFTM_MODAL:
      return {
        ...state,
        wftmModalVisible: true,
      };
    case ModalConstants.HIDE_WFTM_MODAL:
      return {
        ...state,
        wftmModalVisible: false,
      };
    case ModalConstants.SHOW_CONNECT_WALLET_MODAL:
      return {
        ...state,
        connectWalletModalVisible: true,
      };
    case ModalConstants.HIDE_CONNECT_WALLET_MODAL:
      return {
        ...state,
        connectWalletModalVisible: false,
      };
    default: {
      return state;
    }
  }
}
