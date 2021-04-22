import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import styles from './styles.module.scss';

const OfferModal = ({ visible, onClose, onMakeOffer }) => {
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    setPrice('');
    setEndTime(new Date());
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
          <div className={styles.title}>Place your offer</div>
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
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>EndTime *</div>
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
            onClick={() => onMakeOffer(price, endTime)}
          >
            Place Offer
          </div>
          <div className={styles.cancelButton} onClick={onClose}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
