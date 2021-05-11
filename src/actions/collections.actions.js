import CollectionsConstants from '../constants/collections.constants';

const CollectionsActions = {
  fetchStart,
  fetchSuccess,
  fetchFailed,
};

function fetchStart() {
  return dispatch => {
    dispatch({
      type: CollectionsConstants.FETCH_COLLECTIONS_START,
    });
  };
}

function fetchSuccess(collections) {
  return dispatch => {
    dispatch(_fetchSuccess(collections));
  };
}

const _fetchSuccess = collections => {
  return {
    type: CollectionsConstants.FETCH_COLLECTIONS_SUCCESS,
    collections,
  };
};

function fetchFailed() {
  return dispatch => {
    dispatch({
      type: CollectionsConstants.FETCH_COLLECTIONS_FAILED,
    });
  };
}

export default CollectionsActions;
