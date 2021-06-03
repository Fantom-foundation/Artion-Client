import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

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
        <div
          key={cat.id}
          className={cx(
            styles.button,
            cat.id === category ? styles.selected : null
          )}
          onClick={() => handleSelectCategory(cat.id)}
        >
          <img src={cat.icon} />
          {cat.label}
        </div>
      ))}
    </div>
  );
};

export default ExploreHeader;
