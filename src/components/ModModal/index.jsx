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

const ModModal = ({ visible, onClose, isAdding }) => {
  const { getNonce, addMod, removeMod } = useApi();
  const { account } = useWeb3React();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (visible) {
      setAdding(false);
    }
  }, [visible]);

  const handleAddMod = async () => {
    if (adding) return;

    try {
      setAdding(true);

      const { data: nonce } = await getNonce(account, authToken);

      let signature;
      let addr;
      try {
        const signer = await getSigner();
        const msg = `Approve Signature on Artion.io with nonce ${nonce}`;
        signature = await signer.signMessage(msg);
        addr = ethers.utils.verifyMessage(msg, signature);
      } catch (err) {
        toast(
          'error',
          `You need to sign the message to be able to ${
            isAdding ? 'add' : 'remove'
          } a new moderator.`
        );
        setAdding(false);
        return;
      }

      if (isAdding) {
        await addMod(name, address, authToken, signature, addr);
        toast('success', 'Added new moderator!');
      } else {
        await removeMod(address, authToken, signature, addr);
        toast('success', 'Removed moderator!');
      }
    } catch (e) {
      console.log(e);
    }
    setAdding(false);
  };

  return (
    <Modal
      visible={visible}
      title={isAdding ? 'Add Moderator' : 'Remove Moderator'}
      onClose={onClose}
      submitDisabled={adding}
      submitLabel={
        adding ? (
          <ClipLoader color="#FFF" size={16} />
        ) : isAdding ? (
          'Add'
        ) : (
          'Remove'
        )
      }
      onSubmit={!adding ? () => handleAddMod() : null}
    >
      {isAdding && (
        <div className={styles.formGroup}>
          <div className={styles.formLabel}>Name</div>
          <div className={styles.formInputCont}>
            <input
              className={styles.formInput}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={adding}
            />
          </div>
        </div>
      )}
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Address</div>
        <div className={styles.formInputCont}>
          <input
            className={styles.formInput}
            placeholder="0x0000"
            value={address}
            onChange={e => setAddress(e.target.value)}
            disabled={adding}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModModal;
