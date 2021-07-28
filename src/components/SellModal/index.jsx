import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import { formatNumber } from 'utils';
import { FTM_TOTAL_SUPPLY } from 'constants/index';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const SellModal = ({
  visible,
  onClose,
  onSell,
  startPrice,
  confirming,
  approveContract,
  contractApproving,
  contractApproved,
  totalSupply,
}) => {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [focused, setFocused] = useState(false);

  const { price: ftmPrice } = useSelector(state => state.Price);

  useEffect(() => {
    setPrice(startPrice > 0 ? startPrice.toString() : '');
    setQuantity('1');
  }, [visible]);

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

  const handleSellItem = () => {
    let quant = 1;
    if (totalSupply > 1) {
      quant = parseInt(quantity);
    }
    onSell(price, quant);
  };

  const validateInput = () => {
    if (price.length === 0) return false;
    if (totalSupply > 1 && quantity.length === 0) return false;
    return true;
  };

  return (
    <Modal
      visible={visible}
      title={startPrice > 0 ? 'Update Your Listing' : 'Sell Your Item'}
      submitDisabled={
        contractApproving ||
        confirming ||
        (contractApproved && !validateInput())
      }
      submitLabel={
        contractApproved ? (
          confirming ? (
            <ClipLoader color="#FFF" size={16} />
          ) : startPrice > 0 ? (
            'Update Price'
          ) : (
            'List Item'
          )
        ) : contractApproving ? (
          'Approving Item'
        ) : (
          'Approve Item'
        )
      }
      onSubmit={() =>
        contractApproved
          ? !confirming && validateInput()
            ? handleSellItem()
            : null
          : approveContract()
      }
      cancelDisabled={contractApproving || confirming}
      onCancel={!(contractApproving || confirming) ? onClose : null}
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
            disabled={contractApproving || confirming}
          />
          <div className={styles.usdPrice}>
            ${formatNumber(((parseFloat(price) || 0) * ftmPrice).toFixed(2))}
          </div>
        </div>
      </div>
      {totalSupply !== null && (
        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Quantity</div>
          <div className={styles.formInputCont}>
            <input
              className={styles.formInput}
              placeholder={totalSupply}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={contractApproving || confirming || totalSupply === 1}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SellModal;
