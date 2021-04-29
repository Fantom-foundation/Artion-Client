import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import styles from './styles.module.scss';

const AuctionModal = ({ visible, onClose, onStartAuction, auction }) => {
  const [reservePrice, setReservePrice] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    setReservePrice(auction?.reservePrice || '');
    setStartTime(
      auction?.startTime ? new Date(auction.startTime * 1000) : new Date()
    );
    setEndTime(
      auction?.endTime ? new Date(auction.endTime * 1000) : new Date()
    );
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
          <div className={styles.title}>Start Auction</div>
        </div>
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Reserve Price *</div>
            <input
              className={styles.formInput}
              placeholder="0.00"
              value={reservePrice}
              onChange={e => setReservePrice(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Start Time *</div>
            <Datetime
              value={startTime}
              onChange={val => setStartTime(val.toDate())}
              inputProps={{
                className: styles.formInput,
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>End Time *</div>
            <Datetime
              value={endTime}
              onChange={val => setEndTime(val.toDate())}
              inputProps={{
                className: styles.formInput,
              }}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <div
            className={styles.listButton}
            onClick={() => onStartAuction(reservePrice, startTime, endTime)}
          >
            {auction ? 'Update Auction' : 'Start Auction'}
          </div>
          <div className={styles.cancelButton} onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionModal;
