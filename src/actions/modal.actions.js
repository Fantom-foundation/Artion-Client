import ModalConstants from '../constants/modal.constants';

const FilterActions = {
  showAccountModal,
  hideAccountModal,
};

function showAccountModal() {
  return dispatch => {
    dispatch(_showAccountModal());
  };
}

const _showAccountModal = () => {
  return {
    type: ModalConstants.SHOW_ACCOUNT_MODAL,
  };
};

function hideAccountModal() {
  return dispatch => {
    dispatch(_hideAccountModal());
  };
}

const _hideAccountModal = () => {
  return {
    type: ModalConstants.HIDE_ACCOUNT_MODAL,
  };
};

export default FilterActions;
