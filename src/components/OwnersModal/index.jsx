import React from 'react';
import { Link } from 'react-router-dom';

import { shortenAddress, formatNumber } from 'utils';
import Identicon from 'components/Identicon';

import Modal from '../Modal';
import styles from './styles.module.scss';

const Holder = ({ holder, children }) => {
  if (!holder) return <div className={styles.holder}>{children}</div>;

  return (
    <Link to={`/account/${holder?.address}`} className={styles.holder}>
      {children}
    </Link>
  );
};

const OwnersModal = ({ visible, onClose, holders }) => {
  return (
    <Modal visible={visible} title="Owned by" onClose={onClose}>
      {holders.map((holder, idx) => (
        <Holder key={idx} holder={holder}>
          <div className={styles.holderInfo}>
            <div className={styles.avatarWrapper}>
              {holder.imageHash ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${holder.imageHash}`}
                  width={40}
                  height={40}
                />
              ) : (
                <Identicon
                  account={holder.address}
                  size={40}
                  className={styles.avatar}
                />
              )}
            </div>
            <div className={styles.info}>
              <div className={styles.alias}>{holder.alias || 'Unnamed'}</div>
              <div className={styles.address}>
                {shortenAddress(holder.address)}
              </div>
            </div>
          </div>
          <div className={styles.holdCount}>
            {`${formatNumber(holder.supply)} item${
              holder.supply !== 1 ? 's' : ''
            }`}
          </div>
        </Holder>
      ))}
    </Modal>
  );
};

export default OwnersModal;
