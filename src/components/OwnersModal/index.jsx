import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';

import { getTokenHolders } from 'api';
import closeIcon from 'assets/svgs/close.svg';

import styles from './styles.module.scss';

const OwnersModal = ({ visible, onClose, address, tokenId, holdersCount }) => {
  const [holders, setHolders] = useState([]);

  const getHolders = async () => {
    const data = await getTokenHolders(address, tokenId);
    console.log(data);
  };

  useEffect(() => {
    if (visible) {
      getHolders();
    }
  }, [visible, address, tokenId]);

  useEffect(() => {
    setHolders(new Array(holdersCount).fill(null));
  }, [holdersCount]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Owned by</div>
          <div className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon} />
          </div>
        </div>
        <div className={styles.body}>
          {holders.map((holder, idx) => (
            <div key={idx} className={styles.holder}>
              <div className={styles.holderInfo}>
                <div className={styles.avatar}>
                  {holder ? 'X' : <Skeleton width={40} height={40} />}
                </div>
                <div className={styles.info}>
                  <div className={styles.alias}>
                    {holder ? 'Unnamed' : <Skeleton width={100} height={20} />}
                  </div>
                  <div className={styles.address}>
                    {holder ? '0x1234' : <Skeleton width={100} height={20} />}
                  </div>
                </div>
              </div>
              <div className={styles.holdCount}>
                {holder ? '3 items' : <Skeleton width={100} height={20} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnersModal;
