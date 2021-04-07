import CollectionsConstants from '../constants/collections.constants';

const CollectionsActions = {
  updateCollections,
};

function updateCollections(collections) {
  return dispatch => {
    dispatch(_updateCollections(collections));
  };
}

const _updateCollections = collections => {
  return {
    type: CollectionsConstants.UPDATE_COLLECTIONS,
    collections,
  };
};

export default CollectionsActions;
