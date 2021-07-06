import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import toast from 'utils/toast';
import { useApi } from 'api';

import styles from './styles.module.scss';

const BanItemModal = ({ visible, onClose }) => {
  const { banItem } = useApi();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [banning, setBanning] = useState(false);
  const [address, setAddress] = useState('');
  const [tokenID, setTokenID] = useState('');

  useEffect(() => {
    if (visible) {
      setBanning(false);
    }
  }, [visible]);

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBanItem = async () => {
    if (banning) return;

    try {
      setBanning(true);
      await banItem(address, tokenID, authToken);
      toast('success', 'Item banned successfully!');
    } catch (e) {
      console.log(e);
    }
    setBanning(false);
  };

  return (
    <div
      className={cx(styles.container, visible ? styles.visible : null)}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Ban NFT ITem</div>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Contract Address</div>
            <div className={styles.formInputCont}>
              <input
                className={styles.formInput}
                placeholder="0x0000"
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={banning}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>Token ID</div>
            <div className={styles.formInputCont}>
              <input
                className={styles.formInput}
                placeholder="0"
                value={tokenID}
                onChange={e => setTokenID(e.target.value)}
                disabled={banning}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div
            className={cx(styles.listButton, banning && styles.disabled)}
            onClick={!banning ? () => handleBanItem() : null}
          >
            {banning ? <ClipLoader color="#FFF" size={16} /> : 'Ban'}
          </div>
          <div
            className={cx(styles.cancelButton, banning && styles.disabled)}
            onClick={!banning && onClose}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanItemModal;
