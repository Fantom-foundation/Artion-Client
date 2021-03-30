import ModalConstants from '../constants/modal.constants';

const initialState = {
  accountModalVisible: false,
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
    default: {
      return state;
    }
  }
}
