import ModalConstants from '../constants/modal.constants';

const ModalActions = {
  showAccountModal,
  hideAccountModal,
  showWFTMModal,
  hideWFTMModal,
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

function showWFTMModal() {
  return dispatch => {
    dispatch(_showWFTMModal());
  };
}

const _showWFTMModal = () => {
  return {
    type: ModalConstants.SHOW_WFTM_MODAL,
  };
};

function hideWFTMModal() {
  return dispatch => {
    dispatch(_hideWFTMModal());
  };
}

const _hideWFTMModal = () => {
  return {
    type: ModalConstants.HIDE_WFTM_MODAL,
  };
};

export default ModalActions;
