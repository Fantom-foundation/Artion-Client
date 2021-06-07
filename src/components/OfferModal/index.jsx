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
  totalSupply,
}) => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setPrice('');
    setQuantity('1');
    setEndTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuantityChange = e => {
    const val = e.target.value;
    if (!val) {
      setQuantity('');
      return;
    }

    if (isNaN(val)) return;

    const _quantity = parseInt(val);
    setQuantity(Math.min(_quantity, totalSupply));
  };

  const handleMakeOffer = () => {
    let quant = 1;
    if (totalSupply > 1) {
      quant = parseInt(quantity);
    }
    onMakeOffer(price, quant, endTime);
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
            <div className={styles.formInputCont}>
              <input
                className={styles.formInput}
                placeholder="0.00"
                value={price}
                onChange={e =>
                  setPrice(isNaN(e.target.value) ? price : e.target.value)
                }
                disabled={contractApproving || confirming}
              />
              <div className={styles.usdPrice}>
                ${((parseFloat(price) || 0) * ftmPrice).toFixed(2)}
              </div>
            </div>
          </div>
          {totalSupply > 1 && (
            <div className={styles.formGroup}>
              <div className={styles.formLabel}>Quantity</div>
              <div className={styles.formInputCont}>
                <input
                  className={styles.formInput}
                  placeholder={totalSupply}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={contractApproving || confirming}
                />
              </div>
            </div>
          )}
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Offer Expiration</div>
            <div className={styles.formInputCont}>
              <Datetime
                value={endTime}
                onChange={val => setEndTime(val.toDate())}
                inputProps={{
                  className: styles.formInput,
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
                ? !confirming && handleMakeOffer()
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
            onClick={!(contractApproving || confirming) ? onClose : null}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
