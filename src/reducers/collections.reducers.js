import CollectionsConstants from '../constants/collections.constants';

const initialState = {
  collections: [],
  collectionsLoading: false,
};

export function Collections(state = initialState, action) {
  switch (action.type) {
    case CollectionsConstants.FETCH_COLLECTIONS_START: {
      return {
        ...state,
        collectionsLoading: true,
      };
    }
    case CollectionsConstants.FETCH_COLLECTIONS_SUCCESS: {
      return {
        collections: action.collections,
        collectionsLoading: false,
      };
    }
    case CollectionsConstants.FETCH_COLLECTIONS_FAILED: {
      return {
        collections: [],
        collectionsLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
