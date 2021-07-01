import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import { formatNumber } from 'utils';
import { FTM_TOTAL_SUPPLY } from 'constants/index';

import styles from './styles.module.scss';

const BidModal = ({
  visible,
  onClose,
  onPlaceBid,
  minBidAmount,
  confirming,
}) => {
  const [price, setPrice] = useState('');
  const [focused, setFocused] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setPrice(minBidAmount);
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateInput = () => {
    return price.length > 0;
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Place Bid</div>
        </div>
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Price</div>
            <div
              className={cx(styles.formInputCont, focused && styles.focused)}
            >
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={price}
                onChange={e =>
                  setPrice(
                    isNaN(e.target.value)
                      ? price
                      : Math.min(e.target.value, FTM_TOTAL_SUPPLY).toString()
                  )
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={confirming}
              />
              <div className={styles.usdPrice}>
                $
                {formatNumber(((parseFloat(price) || 0) * ftmPrice).toFixed(2))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div
            className={cx(
              styles.listButton,
              (confirming || !validateInput()) && styles.disabled
            )}
            onClick={() =>
              !confirming && validateInput() ? onPlaceBid(price) : null
            }
          >
            {confirming ? <ClipLoader color="#FFF" size={16} /> : 'Place'}
          </div>
          <div
            className={cx(styles.cancelButton, confirming && styles.disabled)}
            onClick={!confirming ? onClose : null}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
