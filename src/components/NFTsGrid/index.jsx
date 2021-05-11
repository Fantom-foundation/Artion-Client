import React from 'react';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import Card from '../NFTCard';

import styles from './styles.module.scss';

const NFTsGrid = ({ items, loading }) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {(items || []).map((item, idx) => (
          <div className={styles.nft} key={idx}>
            <Card item={item} />
          </div>
        ))}
        {loading &&
          new Array(20).fill(0).map((_, idx) => (
            <div className={styles.nft} key={idx}>
              <Card loading />
            </div>
          ))}
      </div>
      {loading && (
        <div className={styles.spinner}>
          <Loader type="ThreeDots" color="#007BFF" height={32} width={32} />
        </div>
      )}
    </div>
  );
};

export default NFTsGrid;
