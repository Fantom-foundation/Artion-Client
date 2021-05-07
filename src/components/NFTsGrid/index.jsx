import React from 'react';

import Card from '../NFTCard';

import styles from './styles.module.scss';

const NFTsGrid = ({ items }) => {
  return (
    <div className={styles.container}>
      {(items || []).map((item, idx) => (
        <div className={styles.nft} key={idx}>
          <Card item={item} />
        </div>
      ))}
    </div>
  );
};

export default NFTsGrid;
