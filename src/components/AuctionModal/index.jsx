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
  auctionStarted,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const [now, setNow] = useState(new Date());
  const [reservePrice, setReservePrice] = useState('');
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() + 2 * 60 * 1000)
  );
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [focused, setFocused] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000);
  }, []);

  useEffect(() => {
    setReservePrice(auction?.reservePrice || '');
    setStartTime(
      auction?.startTime
        ? new Date(auction.startTime * 1000)
        : new Date(new Date().getTime() + 2 * 60 * 1000)
    );
    setEndTime(
      auction?.endTime
        ? new Date(auction.endTime * 1000)
        : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    );
  }, [visible, auction]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateInput = (() => {
    if (reservePrice.length === 0) return false;
    if (!auctionStarted && startTime.getTime() < now.getTime()) return false;
    return endTime.getTime() > startTime.getTime() + 1000 * 60 * 60;
  })();

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>
            {auction ? 'Update Auction' : 'Start Auction'}
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Reserve Price (in FTM)</div>
            <div
              className={cx(styles.formInputCont, focused && styles.focused)}
            >
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={reservePrice}
                onChange={e =>
                  setReservePrice(
                    isNaN(e.target.value) ? reservePrice : e.target.value
                  )
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={contractApproving || confirming}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(reservePrice) || 0) * ftmPrice).toFixed(2)}
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Start Time</div>
            <div className={styles.formInputCont}>
              <Datetime
                value={startTime}
                onChange={val => setStartTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
                  onKeyDown: e => e.preventDefault(),
                  disabled: auctionStarted || contractApproving || confirming,
                }}
                closeOnSelect
                isValidDate={cur =>
                  cur.valueOf() > now.getTime() - 1000 * 60 * 60 * 24
                }
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Auction Expiration</div>
            <div className={styles.formInputCont}>
              <Datetime
                value={endTime}
                onChange={val => setEndTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
                  onKeyDown: e => e.preventDefault(),
                  disabled: contractApproving || confirming,
                }}
                closeOnSelect
                isValidDate={cur =>
                  cur.valueOf() > startTime.getTime() - 1000 * 60 * 60 * 23
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div
            className={cx(
              styles.listButton,
              (contractApproving ||
                confirming ||
                (contractApproved && !validateInput)) &&
                styles.disabled
            )}
            onClick={() =>
              contractApproved
                ? !confirming && validateInput
                  ? onStartAuction(reservePrice, startTime, endTime)
                  : null
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
              'Approving Item'
            ) : (
              'Approve Item'
            )}
          </div>
          <div
            className={cx(
              styles.cancelButton,
              (contractApproving || confirming) && styles.disabled
            )}
            onClick={!(contractApproving || confirming) ? onClose : null}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionModal;
