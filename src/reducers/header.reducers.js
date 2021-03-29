import HeaderConstants from '../constants/header.constants';
/*
    store headerbar related options, like toggle search bar status, 
*/

export function HeaderOptions(state = { isShown: false }, action) {
  switch (action.type) {
    case HeaderConstants.TOGGLESEARCHBAR: {
      return {
        ...state,
        isShown: action.toggle,
      };
    }
    default: {
      return state;
    }
  }
}
