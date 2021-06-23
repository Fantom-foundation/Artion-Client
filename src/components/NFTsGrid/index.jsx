import React from 'react';

import Card from '../NFTCard';

import styles from './styles.module.scss';

const NFTsGrid = ({ items, loading, showCreate, onCreate = () => {} }) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {showCreate && (
          <div className={styles.nft}>
            <Card create onCreate={onCreate} />
          </div>
        )}
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
    </div>
  );
};

export default NFTsGrid;
