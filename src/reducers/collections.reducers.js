import CollectionsConstants from '../constants/collections.constants';

export function Collections(state = [], action) {
  switch (action.type) {
    case CollectionsConstants.UPDATE_COLLECTIONS: {
      return action.collections;
    }
    default: {
      return state;
    }
  }
}
