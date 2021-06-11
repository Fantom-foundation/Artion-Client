import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';

import bg from 'assets/imgs/404.png';

import styles from './styles.module.scss';

const NotFound = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <img src={bg} className={styles.bg} />
      </div>
      <Header />
      <div className={styles.body}>
        <div className={styles.title}>Error 404</div>
        <div className={styles.subtitle}>Sorry! We can not find the page!</div>
        <Link to="/" className={styles.button}>
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
