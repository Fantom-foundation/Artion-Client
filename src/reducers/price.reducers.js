import { PriceConstants } from '../constants/price.constants';

export function Price(
  state = {
    price: 0,
  },
  action
) {
  switch (action.type) {
    case PriceConstants.UPDATE_PRICE: {
      return {
        price: action.price,
      };
    }
    default: {
      return state;
    }
  }
}
