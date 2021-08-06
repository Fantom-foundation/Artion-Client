import TokenConstants from '../constants/tokens.constants';
import FilterConstants from '../constants/filter.constants';

const initialState = {
  upFetching: false,
  downFetching: false,
  count: 0,
  tokens: [],
  from: 0,
  to: 0,
};

export function Tokens(state = initialState, action) {
  switch (action.type) {
    case FilterConstants.UPDATE_STATUS_FILTER:
    case FilterConstants.UPDATE_COLLECTIONS_FILTER:
    case FilterConstants.UPDATE_CATEGORIES_FILTER:
    case FilterConstants.UPDATE_GROUP_TYPE_FILTER:
    case FilterConstants.UPDATE_SORT_BY_FILTER:
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
