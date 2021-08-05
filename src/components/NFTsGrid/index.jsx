import React from 'react';
import cx from 'classnames';

import Card from '../NFTCard';

import styles from './styles.module.scss';

const NFTsGrid = ({
  items,
  numPerRow,
  uploading,
  loading,
  showCreate,
  onCreate = () => {},
  onLike = () => {},
}) => {
  const n = numPerRow || 6;
  const className = cx(styles.nft, styles[`num${n}`]);
  return (
    <>
      {showCreate && (
        <div className={className}>
          <Card create onCreate={onCreate} />
        </div>
      )}
      {uploading &&
        new Array(n * 2).fill(0).map((_, idx) => (
          <div className={className} key={idx}>
            <Card loading />
          </div>
        ))}
      {(items || []).map(item => (
        <div
          className={className}
          key={
            item.items ? item._id : `${item.contractAddress}-${item.tokenID}`
          }
        >
          <Card item={item} onLike={onLike} />
        </div>
      ))}
      {loading &&
        new Array(n * 2).fill(0).map((_, idx) => (
          <div className={className} key={idx}>
            <Card loading />
          </div>
        ))}
    </>
  );
};

export default NFTsGrid;
