import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';

import toast from 'utils/toast';
import { useApi } from 'api';
import { getSigner } from 'contracts';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const BanItemModal = ({ visible, onClose }) => {
  const { getNonce, banItems } = useApi();
  const { account } = useWeb3React();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [banning, setBanning] = useState(false);
  const [address, setAddress] = useState('');
  const [tokenIDs, setTokenIDs] = useState('');

  useEffect(() => {
    if (visible) {
      setBanning(false);
    }
  }, [visible]);

  const handleBanItem = async () => {
    if (banning) return;

    try {
      setBanning(true);

      const { data: nonce } = await getNonce(account, authToken);

      let signature;
      try {
        const signer = await getSigner();
        signature = await signer.signMessage(
          `Approve Signature on Artion.io with nonce ${nonce}`
        );
      } catch (err) {
        toast(
          'error',
          'You need to sign the message to be able to update account settings.'
        );
        setBanning(false);
        return;
      }

      await banItems(address, tokenIDs, authToken, signature);
      toast('success', 'Item banned successfully!');
    } catch (e) {
      console.log(e);
    }
    setBanning(false);
  };

  return (
    <Modal
      visible={visible}
      title="Ban NFT ITems"
      onClose={onClose}
      submitDisabled={banning}
      submitLabel={banning ? <ClipLoader color="#FFF" size={16} /> : 'Ban'}
      onSubmit={!banning ? () => handleBanItem() : null}
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
            value={tokenIDs}
            onChange={e => setTokenIDs(e.target.value)}
            disabled={banning}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BanItemModal;
