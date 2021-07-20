import React from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import FilterActions from 'actions/filter.actions';
import FilterWrapper from 'components/FilterWrapper';

const useStyles = makeStyles(() => ({
  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '8px',
  },
  formControl: {
    width: '100%',
    height: 40,
    boxSizing: 'border-box',
    borderRadius: 4,
    border: '1px solid #D9E1EE',
    cursor: 'pointer',
    margin: '0 !important',
    padding: '11px 16px 10px 16px',
    display: 'flex',
    fontSize: 16,
    fontWeight: '600',
    color: '#3D3D3D',
    backgroundColor: '#FFF',
  },
  selected: {
    backgroundColor: '#2479FA',
    color: '#FFF',
    border: 0,
  },
}));

const ExploreStatus = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    statusBuyNow,
    statusHasBids,
    statusHasOffers,
    statusOnAuction,
  } = useSelector(state => state.Filter);

  const handleStatusChange = (field, selected) => {
    dispatch(FilterActions.updateStatusFilter(field, selected));
  };

  return (
    <FilterWrapper title="Status" classes={{ body: classes.body }}>
      <div
        className={cx(
          classes.formControl,
          statusBuyNow ? classes.selected : null
        )}
        onClick={() => handleStatusChange('statusBuyNow', !statusBuyNow)}
      >
        Buy Now
      </div>
      <div
        className={cx(
          classes.formControl,
          statusHasBids ? classes.selected : null
        )}
        onClick={() => handleStatusChange('statusHasBids', !statusHasBids)}
      >
        Has Bids
      </div>
      <div
        className={cx(
          classes.formControl,
          statusHasOffers ? classes.selected : null
        )}
        onClick={() => handleStatusChange('statusHasOffers', !statusHasOffers)}
      >
        Has Offers
      </div>
      <div
        className={cx(
          classes.formControl,
          statusOnAuction ? classes.selected : null
        )}
        onClick={() => handleStatusChange('statusOnAuction', !statusOnAuction)}
      >
        On Auction
      </div>
    </FilterWrapper>
  );
};

export default ExploreStatus;
