import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import toast from 'utils/toast';
import { useApi } from 'api';

import styles from './styles.module.scss';

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

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

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
    <div
      className={cx(styles.container, visible ? styles.visible : null)}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>Boost Collection</div>
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
                disabled={boosting}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div
            className={cx(styles.listButton, boosting && styles.disabled)}
            onClick={!boosting ? () => handleBoostCollection() : null}
          >
            {boosting ? <ClipLoader color="#FFF" size={16} /> : 'Boost'}
          </div>
          <div
            className={cx(styles.cancelButton, boosting && styles.disabled)}
            onClick={!boosting ? onClose : null}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostCollectionModal;
