import { AuthConstants } from '../constants/auth.constants';

const AuthActions = {
  fetchStart,
  fetchSuccess,
  fetchFailed,
  signOut,
};

function fetchStart() {
  return dispatch => {
    dispatch(_fetchStart());
  };
}

const _fetchStart = () => {
  return {
    type: AuthConstants.PROFILE_GET_START,
  };
};

function fetchSuccess(user) {
  return dispatch => {
    dispatch(_fetchSuccess(user));
  };
}

const _fetchSuccess = user => {
  return {
    type: AuthConstants.PROFILE_GET_SUCCESS,
    payload: user,
  };
};

function fetchFailed() {
  return dispatch => {
    dispatch(_fetchFailed());
  };
}

const _fetchFailed = () => {
  return {
    type: AuthConstants.PROFILE_GET_FAILED,
  };
};

function signOut() {
  return dispatch => {
    dispatch(_signOut());
  };
}

const _signOut = () => {
  return {
    type: AuthConstants.SIGN_OUT,
  };
};

export default AuthActions;
