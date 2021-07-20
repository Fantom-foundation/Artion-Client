import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import FilterWrapper from 'components/FilterWrapper';
import { Categories } from 'constants/filter.constants';
import FilterActions from 'actions/filter.actions';

import iconCheck from 'assets/svgs/check_blue.svg';

import './styles.scss';

const useStyles = makeStyles(() => ({
  body: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  collectionsList: {
    overflowY: 'auto',
    maxHeight: 260,
  },
  collection: {
    height: 40,
    padding: '0 8px',
    margin: '12px 0',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    '&:first-child': {
      marginTop: 0,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid #D9E1EE',
    marginRight: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& img': {
      width: 24,
      height: 24,
    },
  },
  name: {
    fontWeight: 700,
    fontSize: 16,
    color: '#000',
    opacity: 0.6,
    marginRight: 4,
  },
}));

const CategoriesFilter = () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const { category } = useSelector(state => state.Filter);

  const handleSelectCategory = categoryId => {
    dispatch(
      FilterActions.updateCategoryFilter(
        category === categoryId ? null : categoryId
      )
    );
  };

  return (
    <FilterWrapper title="Categories" classes={{ body: classes.body }}>
      <div className={classes.collectionsList}>
        {Categories.map(cat => (
          <div
            key={cat.id}
            className={classes.collection}
            onClick={() => handleSelectCategory(cat.id)}
          >
            <div className={classes.logo}>
              <img src={cat.id === category ? iconCheck : cat.icon} />
            </div>
            <span className={classes.name}>{cat.label}</span>
          </div>
        ))}
      </div>
    </FilterWrapper>
  );
};

export default CategoriesFilter;
