import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { ClipLoader } from 'react-spinners';

import styles from './styles.module.scss';

const AuctionModal = ({
  visible,
  onClose,
  onStartAuction,
  auction,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const [reservePrice, setReservePrice] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [focused, setFocused] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setReservePrice(auction?.reservePrice || '');
    setStartTime(
      auction?.startTime ? new Date(auction.startTime * 1000) : new Date()
    );
    setEndTime(
      auction?.endTime ? new Date(auction.endTime * 1000) : new Date()
    );
  }, [visible, auction]);

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
            <div
              className={cx(styles.formInputCont, focused && styles.focused)}
            >
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={reservePrice}
                onChange={e => setReservePrice(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(reservePrice) || 0) * ftmPrice).toFixed(2)}
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Start Time *</div>
            <div className={styles.formInputCont}>
              <Datetime
                value={startTime}
                onChange={val => setStartTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
                }}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>End Time *</div>
            <div className={styles.formInputCont}>
              <Datetime
                value={endTime}
                onChange={val => setEndTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
                }}
              />
            </div>
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
                ? !confirming &&
                  onStartAuction(reservePrice, startTime, endTime)
                : approveContract()
            }
          >
            {contractApproved ? (
              confirming ? (
                <ClipLoader color="#FFF" size={16} />
              ) : auction ? (
                'Update Auction'
              ) : (
                'Start Auction'
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

export default AuctionModal;
