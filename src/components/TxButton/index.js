import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import ModalActions from 'actions/modal.actions';

const TxButton = ({ onClick, children, ...rest }) => {
  const dispatch = useDispatch();
  const { chainId } = useWeb3React();

  const handleClick = e => {
    if (chainId) {
      onClick(e);
    } else {
      dispatch(ModalActions.showConnectWalletModal());
    }
  };

  return (
    <div {...rest} onClick={handleClick}>
      {children}
    </div>
  );
};

export default TxButton;
