import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import closeIcon from 'assets/svgs/close.svg';
import { shortenAddress, formatNumber } from 'utils';
import Identicon from 'components/Identicon';

import styles from './styles.module.scss';

const Follower = ({ user, onClose, children }) => {
  if (!user) return <div className={styles.holder}>{children}</div>;

  return (
    <Link
      to={`/account/${user?.address}`}
      className={styles.holder}
      onClick={onClose}
    >
      {children}
    </Link>
  );
};

const FollowersModal = ({ visible, onClose, title, users }) => {
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon} />
          </div>
        </div>
        <div className={styles.body}>
          {users.map((user, idx) => (
            <Follower key={idx} user={user} onClose={onClose}>
              <div className={styles.holderInfo}>
                <div className={styles.avatarWrapper}>
                  {!user ? (
                    <Skeleton width={40} height={40} />
                  ) : user.imageHash ? (
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Identicon
                      account={user.address}
                      size={40}
                      className={styles.avatar}
                    />
                  )}
                </div>
                <div className={styles.info}>
                  <div className={styles.alias}>
                    {user ? (
                      user.alias || 'Unnamed'
                    ) : (
                      <Skeleton width={100} height={20} />
                    )}
                  </div>
                  <div className={styles.address}>
                    {user ? (
                      shortenAddress(user.address)
                    ) : (
                      <Skeleton width={100} height={20} />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.followers}>
                {user ? (
                  `${formatNumber(user.followers)} follower${
                    user.followers !== 1 ? 's' : ''
                  }`
                ) : (
                  <Skeleton width={80} height={24} />
                )}
              </div>
            </Follower>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
