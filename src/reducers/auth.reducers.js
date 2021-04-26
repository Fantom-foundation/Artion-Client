import { AuthConstants } from '../constants/auth.constants';

export function Auth(
  state = {
    fetching: false,
    user: {},
  },
  action
) {
  switch (action.type) {
    case AuthConstants.PROFILE_GET_START: {
      return {
        ...state,
        fetching: true,
      };
    }
    case AuthConstants.PROFILE_GET_SUCCESS: {
      return {
        ...state,
        fetching: false,
        user: action.payload,
      };
    }
    case AuthConstants.PROFILE_GET_FAILED: {
      return {
        ...state,
        fetching: false,
        user: {},
      };
    }
    case AuthConstants.SIGN_OUT: {
      return {
        ...state,
        user: {},
      };
    }

    default: {
      return state;
    }
  }
}
