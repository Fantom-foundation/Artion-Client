import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import styles from './styles.module.scss';

const SellModal = ({
  visible,
  onClose,
  onSell,
  startPrice,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
}) => {
  const [price, setPrice] = useState('');
  const [focused, setFocused] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setPrice(startPrice > 0 ? startPrice.toString() : '');
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>
            {startPrice > 0 ? 'Update Your Listing' : 'Sell Your Item'}
          </div>
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
                onChange={e => setPrice(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={contractApproving || confirming}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(price) || 0) * ftmPrice).toFixed(2)}
              </div>
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
                ? !confirming && onSell(price)
                : approveContract()
            }
          >
            {contractApproved ? (
              confirming ? (
                <ClipLoader color="#FFF" size={16} />
              ) : startPrice > 0 ? (
                'Update Price'
              ) : (
                'List Item'
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

export default SellModal;
