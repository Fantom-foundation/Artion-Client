import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import styles from './styles.module.scss';

const BidModal = ({
  visible,
  onClose,
  onPlaceBid,
  minBidAmount,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const [price, setPrice] = useState('');

  useEffect(() => {
    setPrice(minBidAmount);
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={cx(styles.container, visible ? styles.visible : null)}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Place Bid</div>
        </div>
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Price *</div>
            <input
              className={styles.formInput}
              placeholder="0.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <div
            className={cx(
              styles.listButton,
              (contractApproving || confirming) && styles.disabled
            )}
            onClick={() =>
              contractApproved
                ? !confirming && onPlaceBid(price)
                : approveContract()
            }
          >
            {contractApproved ? (
              confirming ? (
                <ClipLoader color="#FFF" size={16} />
              ) : (
                'Place'
              )
            ) : contractApproving ? (
              'Approving Contract'
            ) : (
              'Appove Contract'
            )}
          </div>
          <div className={styles.cancelButton} onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
