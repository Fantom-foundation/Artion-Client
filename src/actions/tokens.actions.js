import TokensConstants from '../constants/tokens.constants';

const TokensActions = {
  resetTokens,
  startFetching,
  fetchingSuccess,
  fetchingFailed,
};

function resetTokens() {
  return dispatch => {
    dispatch(_resetTokens());
  };
}

const _resetTokens = () => {
  return {
    type: TokensConstants.RESET_TOKENS,
  };
};

function startFetching() {
  return dispatch => {
    dispatch(_startFetching());
  };
}

const _startFetching = () => {
  return {
    type: TokensConstants.FETCHING_START,
  };
};

function fetchingSuccess(count, tokens) {
  return dispatch => {
    dispatch(_fetchingSuccess(count, tokens));
  };
}

const _fetchingSuccess = (count, tokens) => {
  return {
    type: TokensConstants.FETCHING_SUCCESS,
    payload: {
      count,
      tokens,
    },
  };
};

function fetchingFailed() {
  return dispatch => {
    dispatch(_fetchingFailed());
  };
}

const _fetchingFailed = () => {
  return {
    type: TokensConstants.FETCHING_FAILED,
  };
};

export default TokensActions;
