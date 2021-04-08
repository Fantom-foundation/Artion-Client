import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import HeaderActions from '../../actions/header.actions';
import graphics from 'assets/imgs/graphics.png';

import styles from './styles.module.scss';

const LandingPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const goToCreate = () => {
    dispatch(HeaderActions.toggleSearchbar(false));
    history.push('/create');
  };

  const goToExploreAll = () => {
    dispatch(HeaderActions.toggleSearchbar(true));
    history.push('/exploreall');
  };

  return (
    <div className={styles.container}>
      <img src={graphics} className={styles.graphics} />
      <div className={styles.body}>
        <div className={styles.title}>
          The largest NFT marketplace on Fantom
        </div>
        <div className={styles.subtitle}>
          Create, Buy, Sell and Discover rare digital assets
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.exploreButton} onClick={goToExploreAll}>
            Explore
          </div>
          <div className={styles.createButton} onClick={goToCreate}>
            Create
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
