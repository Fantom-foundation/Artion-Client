import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import toast from 'utils/toast';
import { useApi } from 'api';
import { getSigner } from 'contracts';

import Modal from '../Modal';
import styles from '../Modal/common.module.scss';

const BanUserModal = ({ visible, onClose }) => {
  const { getNonce, banUser } = useApi();
  const { account } = useWeb3React();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [banning, setBanning] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (visible) {
      setBanning(false);
    }
  }, [visible]);

  const handleBanUser = async () => {
    if (banning) return;

    try {
      setBanning(true);

      const { data: nonce } = await getNonce(account, authToken);

      let signature;
      let addr;
      try {
        const signer = await getSigner();
        const msg = `Approve Signature on Artion.io with nonce ${nonce}`;
        signature = await signer.signMessage(msg);
        addr = ethers.utils.verifyMessage(msg, signature);
      } catch (err) {
        toast('error', 'You need to sign the message to be able to ban user.');
        setBanning(false);
        return;
      }

      let response = await banUser(address, authToken, signature, addr);

      response.status == 'success'
        ? toast('success', 'User banned successfully!')
        : toast('error', 'User already banned');

      setBanning(false);
    } catch (e) {
      console.log(e);
      toast('error', 'Error occured while banning a user!');
    }
    setBanning(false);
  };

  return (
    <Modal
      visible={visible}
      title="Ban User"
      onClose={onClose}
      submitDisabled={banning}
      submitLabel={banning ? <ClipLoader color="#FFF" size={16} /> : 'Ban'}
      onSubmit={!banning ? () => handleBanUser() : null}
    >
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>User Address</div>
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
    </Modal>
  );
};

export default BanUserModal;
