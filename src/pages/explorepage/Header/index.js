import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import Button from '@material-ui/core/Button';

import { Categories } from '../../../constants/filter.constants';
import FilterActions from '../../../actions/filter.actions';

import styles from './styles.module.scss';

const ExploreHeader = () => {
  const dispatch = useDispatch();

  const { category } = useSelector(state => state.Filter);

  const handleSelectCategory = categoryId => {
    dispatch(
      FilterActions.updateCategoryFilter(
        category === categoryId ? null : categoryId
      )
    );
  };

  return (
    <div className={styles.root}>
      {Categories.map(cat => (
        <Button
          key={cat.id}
          variant="contained"
          color="default"
          className={cx(
            styles.button,
            cat.id === category ? styles.selected : null
          )}
          startIcon={<cat.icon />}
          onClick={() => handleSelectCategory(cat.id)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
};

export default ExploreHeader;
