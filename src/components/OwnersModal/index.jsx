import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import { getTokenHolders } from 'api';
import closeIcon from 'assets/svgs/close.svg';
import { shortenAddress } from 'utils';
import Identicon from 'components/Identicon';

import styles from './styles.module.scss';

const Holder = ({ holder, children }) => {
  if (!holder) return <div className={styles.holder}>{children}</div>;

  return (
    <Link to={`/account/${holder?.address}`} className={styles.holder}>
      {children}
    </Link>
  );
};

const OwnersModal = ({ visible, onClose, address, tokenId, holdersCount }) => {
  const [holders, setHolders] = useState([]);

  const getHolders = async () => {
    try {
      const { data } = await getTokenHolders(address, tokenId);
      setHolders(data);
    } catch {
      setHolders([]);
    }
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
            <Holder key={idx} holder={holder}>
              <div className={styles.holderInfo}>
                <div className={styles.avatar}>
                  {holder ? (
                    holder.imageHash ? (
                      <img
                        src={`https://gateway.pinata.cloud/ipfs/${holder.imageHash}`}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Identicon account={holder.address} size={40} />
                    )
                  ) : (
                    <Skeleton width={40} height={40} />
                  )}
                </div>
                <div className={styles.info}>
                  <div className={styles.alias}>
                    {holder ? (
                      holder.alias || 'Unnamed'
                    ) : (
                      <Skeleton width={100} height={20} />
                    )}
                  </div>
                  <div className={styles.address}>
                    {holder ? (
                      shortenAddress(holder.address)
                    ) : (
                      <Skeleton width={100} height={20} />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.holdCount}>
                {holder ? (
                  `${holder.supply} item${holder.supply > 1 ? 's' : ''}`
                ) : (
                  <Skeleton width={100} height={20} />
                )}
              </div>
            </Holder>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnersModal;
