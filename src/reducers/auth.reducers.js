import { AuthConstants } from '../constants/auth.constants';

export function Auth(
  state = {
    isLoggedIn: false,
    authToken: null,
  },
  action
) {
  switch (action.type) {
    case AuthConstants.SIGNINSUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        authToken: action.token,
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
    case AuthConstants.SIGNOUT: {
      return {
        ...state,
        isLoggedIn: false,
        authToken: null,
      };
    }

    default: {
      return state;
    }
  }
}
