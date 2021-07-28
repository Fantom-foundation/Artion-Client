import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import toast from 'utils/toast';
import { useApi } from 'api';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

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
    <Modal
      visible={visible}
      title="Ban NFT ITem"
      submitDisabled={banning}
      submitLabel={banning ? <ClipLoader color="#FFF" size={16} /> : 'Ban'}
      onSubmit={!banning ? () => handleBanItem() : null}
      cancelDisabled={banning}
      onCancel={!banning && onClose}
    >
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
    </Modal>
  );
};

export default BanItemModal;
