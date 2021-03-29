import HeaderConstants from '../constants/header.constants';

const HeaderActions = {
  toggleSearchbar,
};

function toggleSearchbar(toggle) {
  return dispatch => {
    dispatch(_toggleSearchbar(toggle));
  };
}

const _toggleSearchbar = toggle => {
  return {
    type: HeaderConstants.TOGGLESEARCHBAR,
    toggle: toggle,
  };
};

export default HeaderActions;
