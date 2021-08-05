import TokenConstants from '../constants/tokens.constants';

const initialState = {
  upFetching: false,
  downFetching: false,
  count: 0,
  tokens: [],
  hasPrev: false,
  hasNext: false,
};

export function Tokens(state = initialState, action) {
  switch (action.type) {
    case TokenConstants.RESET_TOKENS:
      return initialState;
    case TokenConstants.UPDATE_TOKENS:
      return {
        ...state,
        tokens: action.payload.tokens,
      };
    case TokenConstants.FETCHING_START:
      if (action.payload.direction < 0) {
        return {
          ...state,
          upFetching: true,
        };
      }
      return {
        ...state,
        downFetching: true,
      };
    case TokenConstants.FETCHING_SUCCESS:
      return {
        ...state,
        upFetching: false,
        downFetching: false,
        ...action.payload,
      };
    case TokenConstants.FETCHING_FAILED:
      return {
        ...state,
        upFetching: false,
        downFetching: false,
      };
    default: {
      return state;
    }
  }
}
