import { AuthConstants } from '../constants/auth.constants';

const AuthActions = {
  signin,
  signinSuccess,
  signinFailed,
  signupSuccess,
  signupFailed,
  signout,
};

function signin() {
  return dispatch => {
    dispatch(_signin());
  };
}

const _signin = () => {
  return {
    type: AuthConstants.SIGNUPREQUEST,
  };
};

function signinSuccess() {
  return dispatch => {
    dispatch(_signinSuccess());
  };
}

const _signinSuccess = () => {
  return {
    type: AuthConstants.SIGNINSUCCESS,
  };
};

function signinFailed() {
  return dispatch => {
    dispatch(_signinFailed());
  };
}

const _signinFailed = () => {
  return {
    type: AuthConstants.SIGNUPREQUEST,
  };
};

function signupSuccess() {
  return dispatch => {
    dispatch(_signupSuccess());
  };
}

const _signupSuccess = () => {
  return {
    type: AuthConstants.SIGNUPSUCCESS,
  };
};

function signupFailed() {
  return dispatch => {
    dispatch(_signupFailed());
  };
}

const _signupFailed = () => {
  return {
    type: AuthConstants.SIGNUPFAILED,
  };
};

function signout() {
  return dispatch => {
    dispatch(_signout());
  };
}

const _signout = () => {
  return {
    type: AuthConstants.SIGNUPREQUEST,
  };
};

export default AuthActions;
