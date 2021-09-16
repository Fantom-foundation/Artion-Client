import React, { useEffect } from 'react';
import cx from 'classnames';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

import { SUPPORTED_WALLETS } from 'constants/wallet';
import usePrevious from 'hooks/usePrevious';

import Modal from '../Modal';
import styles from './styles.module.scss';

// eslint-disable-next-line no-undef
const isMainnet = process.env.REACT_APP_ENV === 'MAINNET';

const Option = ({ onClick = null, header, icon, active = false }) => {
  return (
    <div
      onClick={onClick}
      className={cx(styles.option, active && styles.active)}
    >
      <div className={styles.header}>{header}</div>
      <img src={icon} className={styles.icon} />
    </div>
  );
};

const ConnectWalletModal = ({ visible, onClose }) => {
  const { activate, active, connector, error, deactivate } = useWeb3React();

  // close modal when a connection is successful
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);
  useEffect(() => {
    if (
      visible &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      onClose();
    }
  }, [active, error, connector, visible, activePrevious, connectorPrevious]);

  const tryActivation = async connector => {
    let conn = typeof connector === 'function' ? await connector() : connector;

    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });

    conn &&
      activate(conn, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(conn); // a little janky...can't use setError because the connector isn't set
        }
      });
  };

  const getOptions = () => {
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key];

      return (
        <Option
          onClick={() => {
            option.connector === connector
              ? null
              : tryActivation(option.connector);
          }}
          key={key}
          active={option.connector === connector}
          header={option.name}
          icon={option.icon}
        />
      );
    });
  };

  const getModalContent = () => {
    if (error instanceof UnsupportedChainIdError) {
      return (
        <div>
          <div className={styles.text}>
            Please connect to the{' '}
            {isMainnet ? 'Fantom Opera' : 'Fantom Testnet'}.
          </div>
          <div className={styles.switchBtn} onClick={deactivate}>
            Disconnect
          </div>
        </div>
      );
    }
    return getOptions();
  };

  return (
    <Modal
      visible={visible}
      title={
        error instanceof UnsupportedChainIdError
          ? 'Wrong Network'
          : 'Connect to a wallet'
      }
      onClose={onClose}
      small
    >
      {getModalContent()}
    </Modal>
  );
};

export default ConnectWalletModal;
