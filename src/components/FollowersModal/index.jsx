import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { shortenAddress, formatFollowers } from 'utils';
import Identicon from 'components/Identicon';

import Modal from '../Modal';
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
  return (
    <Modal visible={visible} title={title} onClose={onClose}>
      {users.map((user, idx) => (
        <Follower key={idx} user={user} onClose={onClose}>
          <div className={styles.holderInfo}>
            <div className={styles.avatarWrapper}>
              {!user ? (
                <Skeleton width={40} height={40} />
              ) : user.imageHash ? (
                <img
                  src={`https://cloudflare-ipfs.com/ipfs/${user.imageHash}`}
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
              `${formatFollowers(user.followers)} follower${
                user.followers !== 1 ? 's' : ''
              }`
            ) : (
              <Skeleton width={80} height={24} />
            )}
          </div>
        </Follower>
      ))}
    </Modal>
  );
};

export default FollowersModal;
