import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const TransferModal = ({
  visible,
  totalSupply,
  transferring,
  onTransfer,
  onClose,
}) => {
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    if (visible) {
      setAddress('');
      setQuantity('1');
    }
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

  const handleTransfer = () => {
    let quant = 1;
    if (totalSupply > 1) {
      quant = parseInt(quantity);
    }
    onTransfer(address, quant);
  };

  return (
    <Modal
      visible={visible}
      title="Transfer Item"
      onClose={onClose}
      submitDisabled={transferring}
      submitLabel={
        transferring ? <ClipLoader color="#FFF" size={16} /> : 'Transfer'
      }
      onSubmit={!transferring ? () => handleTransfer() : null}
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Transfer to</div>
        <div className={styles.formInputCont}>
          <input
            className={styles.formInput}
            placeholder="0x0000"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={transferring}
          />
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
              disabled={transferring || totalSupply === 1}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TransferModal;
