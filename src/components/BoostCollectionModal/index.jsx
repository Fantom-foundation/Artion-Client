import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import toast from 'utils/toast';
import { useApi } from 'api';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const BoostCollectionModal = ({ visible, onClose }) => {
  const { boostCollection } = useApi();
  const { authToken } = useSelector(state => state.ConnectWallet);

  const [boosting, setBoosting] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (visible) {
      setBoosting(false);
    }
  }, [visible]);

  const handleBoostCollection = async () => {
    if (boosting) return;

    try {
      setBoosting(true);
      await boostCollection(address, authToken);
      toast('success', 'Collection boosted successfully!');
    } catch (e) {
      console.log(e);
    }
    setBoosting(false);
  };

  return (
    <Modal
      visible={visible}
      title="Boost Collection"
      onClose={onClose}
      submitDisabled={boosting}
      submitLabel={boosting ? <ClipLoader color="#FFF" size={16} /> : 'Boost'}
      onSubmit={!boosting ? () => handleBoostCollection() : null}
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Contract Address</div>
        <div className={styles.formInputCont}>
          <input
            className={styles.formInput}
            placeholder="0x0000"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={boosting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BoostCollectionModal;
