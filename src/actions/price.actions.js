import { PriceConstants } from '../constants/price.constants';

const PriceActions = {
  updatePrice,
};

function updatePrice(price) {
  return dispatch => {
    dispatch(_updatePrice(price));
  };
}

const _updatePrice = price => {
  return {
    type: PriceConstants.UPDATE_PRICE,
    price,
  };
};

export default PriceActions;
