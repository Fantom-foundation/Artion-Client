import TokenConstants from '../constants/tokens.constants';

const initialState = {
  fetching: false,
  count: 0,
  tokens: [],
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
      return {
        ...state,
        fetching: true,
      };
    case TokenConstants.FETCHING_SUCCESS:
      return {
        ...state,
        fetching: false,
        count: action.payload.count,
        tokens: [...state.tokens, ...action.payload.tokens],
      };
    case TokenConstants.FETCHING_FAILED:
      return {
        ...state,
        fetching: false,
      };
    default: {
      return state;
    }
  }
}
