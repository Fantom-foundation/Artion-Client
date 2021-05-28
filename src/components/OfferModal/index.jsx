import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { ClipLoader } from 'react-spinners';

import styles from './styles.module.scss';

const OfferModal = ({
  visible,
  onClose,
  onMakeOffer,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setPrice('');
    setEndTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Place your offer</div>
        </div>
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Price</div>
            <div
              className={cx(styles.formInputCont, focused1 && styles.focused1)}
            >
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={price}
                onChange={e =>
                  setPrice(isNaN(e.target.value) ? price : e.target.value)
                }
                onFocus={() => setFocused1(true)}
                onBlur={() => setFocused1(false)}
                disabled={contractApproving || confirming}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(price) || 0) * ftmPrice).toFixed(2)}
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>EndTime</div>
            <div
              className={cx(styles.formInputCont, focused2 && styles.focused1)}
            >
              <Datetime
                value={endTime}
                onChange={val => setEndTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
                  onFocus: () => setFocused2(true),
                  onBlur: () => setFocused2(false),
                  onKeyDown: e => e.preventDefault(),
                  disabled: contractApproving || confirming,
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
                ? !confirming && onMakeOffer(price, endTime)
                : approveContract()
            }
          >
            {contractApproved ? (
              confirming ? (
                <ClipLoader color="#FFF" size={16} />
              ) : (
                'Place Offer'
              )
            ) : contractApproving ? (
              'Approving Contract'
            ) : (
              'Appove Contract'
            )}
          </div>
          <div
            className={cx(
              styles.cancelButton,
              (contractApproving || confirming) && styles.disabled
            )}
            onClick={!(contractApproving || confirming) && onClose}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
