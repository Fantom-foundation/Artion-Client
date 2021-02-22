import { AuthConstants } from '../constants/auth.constants';

export function Auth(
  state = {
    isLoggedIn: false,
  },
  action
) {
  switch (action.type) {
    case AuthConstants.SIGNINSUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    case AuthConstants.SIGNINFAILED: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    case AuthConstants.SIGNUPSUCCESS: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    case AuthConstants.SIGNUPFAILED: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }

    default: {
      return state;
    }
  }
}
