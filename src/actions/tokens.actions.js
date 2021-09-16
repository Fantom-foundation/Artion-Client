import TokensConstants from '../constants/tokens.constants';

const TokensActions = {
  resetTokens,
  updateTokens,
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

function updateTokens(tokens) {
  return dispatch => {
    dispatch(_updateTokens(tokens));
  };
}

const _updateTokens = tokens => {
  return {
    type: TokensConstants.UPDATE_TOKENS,
    payload: {
      tokens,
    },
  };
};

function startFetching(direction) {
  return dispatch => {
    dispatch(_startFetching(direction));
  };
}

const _startFetching = direction => {
  return {
    type: TokensConstants.FETCHING_START,
    payload: {
      direction,
    },
  };
};

function fetchingSuccess(count, tokens, from, to) {
  return dispatch => {
    dispatch(_fetchingSuccess(count, tokens, from, to));
  };
}

const _fetchingSuccess = (count, tokens, from, to) => {
  return {
    type: TokensConstants.FETCHING_SUCCESS,
    payload: {
      count,
      tokens,
      from,
      to,
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
