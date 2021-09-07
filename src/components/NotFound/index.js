import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';

import man from 'assets/imgs/404_man.png';

import styles from './styles.module.scss';

const NotFound = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.title}>404</div>
          <div className={styles.subtitle}>
            Oooooops! We couldn’t find the page you’re looking for :(
          </div>
          <Link to="/" className={styles.button}>
            Back To Home
          </Link>
        </div>
        <img src={man} alt="man" className={styles.man} />
      </div>
    </div>
  );
};

export default NotFound;
