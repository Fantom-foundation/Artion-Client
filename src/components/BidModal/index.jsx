import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import { formatNumber } from 'utils';
import { FTM_TOTAL_SUPPLY } from 'constants/index';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

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

  const validateInput = () => {
    return price.length > 0;
  };

  return (
    <Modal
      visible={visible}
      title="Place Bid"
      onClose={onClose}
      submitDisabled={confirming || !validateInput()}
      submitLabel={confirming ? <ClipLoader color="#FFF" size={16} /> : 'Place'}
      onSubmit={() =>
        !confirming && validateInput() ? onPlaceBid(price) : null
      }
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Price (FTM)</div>
        <div className={cx(styles.formInputCont, focused && styles.focused)}>
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
            ${formatNumber(((parseFloat(price) || 0) * ftmPrice).toFixed(2))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BidModal;
