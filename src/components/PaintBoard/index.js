import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InfoIcon from '@material-ui/icons/Info';

import HeaderActions from 'actions/header.actions';
// import { Container, Board, Canvas, CanvasBg } from './style';
import Header from 'components/header';
// import Layout from './layout';
// import Toolbar from './toolbar';
// import Metadata from './metadata';
import ImageEditor from 'components/ImageEditor';
import { calculateGasMargin } from 'utils';
import showToast from 'utils/toast';
import WalletUtils from 'utils/wallet';
import SCHandlers from 'utils/sc.interaction';
import { API_URL } from 'api';
import { FantomNFTConstants } from 'constants/smartcontracts/fnft.constants';

import whiteTheme from './white-theme';

import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import styles from './styles.module.scss';

const mintSteps = [
  'Uploading to IPFS',
  'Create your NFT',
  'Confirming the Transaction',
];

const PaintBoard = () => {
  const dispatch = useDispatch();

  const { account, chainId } = useWeb3React();

  const ref = useRef();

  const [imageEditor, setImageEditor] = useState(null);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');

  const [currentMintingStep, setCurrentMintingStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const [lastMintedTkId, setLastMintedTkId] = useState(0);
  const [lastMintedTnxId, setLastMintedTnxId] = useState('');

  const isWalletConnected = useSelector(
    state => state.ConnectWallet.isConnected
  );
  const authToken = useSelector(state => state.ConnectWallet.authToken);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  useEffect(() => {
    if (ref.current) {
      setImageEditor(ref.current.getInstance());
    }
  }, [ref.current]);

  const validateMetadata = () => {
    return name != '' && symbol != '' && account != '';
  };

  const resetMintingStatus = () => {
    setTimeout(() => {
      setIsMinting(false);
      setCurrentMintingStep(0);
    }, 1000);
  };

  const mintNFT = async () => {
    if (!isWalletConnected) {
      showToast('info', 'Connect your wallet first');
      return;
    }
    if (chainId != 250) {
      showToast('info', 'You are not connected to Fantom Opera Network');
      return;
    }
    const balance = await WalletUtils.checkBalance(account);

    if (balance < 5) {
      showToast(
        'custom',
        `Your balance should be at least 5 FTM to mint an NFT`
      );
      return;
    }

    setLastMintedTkId(0);
    setLastMintedTnxId('');
    // show stepper
    setIsMinting(true);
    console.log('created from ', account);
    if (!validateMetadata()) {
      resetMintingStatus();
      return;
    }

    let formData = new FormData();
    formData.append('image', imageEditor.toDataURL());
    formData.append('name', name);
    formData.append('account', account);
    formData.append('description', description);
    formData.append('symbol', symbol);
    try {
      let result = await axios({
        method: 'post',
        url: `${API_URL}/ipfs/uploadImage2Server`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('upload image result is ');
      console.log(result);

      const jsonHash = result.data.jsonHash;

      let fnft_sc = await SCHandlers.loadContract(
        FantomNFTConstants.MAINNETADDRESS,
        FantomNFTConstants.ABI
      );

      const provider = fnft_sc[1];
      fnft_sc = fnft_sc[0];

      try {
        const args = [account, jsonHash];
        const options = {
          value: ethers.utils.parseEther('5'),
        };
        const gasEstimate = await fnft_sc.estimateGas.mint(...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        let tx = await fnft_sc.mint(...args, options);
        setCurrentMintingStep(1);
        setLastMintedTnxId(tx.hash);

        setCurrentMintingStep(2);
        const confirmedTnx = await provider.waitForTransaction(tx.hash);
        setCurrentMintingStep(3);
        let evtCaught = confirmedTnx.logs[0].topics;
        let mintedTkId = BigNumber.from(evtCaught[3]);
        setLastMintedTkId(mintedTkId.toNumber());

        showToast('success', 'New NFT item minted!');
        setName('fAsset');
        setSymbol('newnft');
        setDescription('');
      } catch (error) {
        showToast('error', error.message);
      }
    } catch (error) {
      showToast('error', error.message);
    }
    resetMintingStatus();
  };

  const options = {
    includeUI: {
      theme: whiteTheme,
      menuBarPosition: 'right',
      uiSize: {
        height: '100%',
        width: '100%',
      },
    },
    cssMaxWidth: 512,
    cssMaxHeight: 512,
  };

  return (
    <div className={styles.container}>
      <Header light />
      <div className={styles.body}>
        <div className={styles.board}>
          <ImageEditor ref={ref} {...options} />
        </div>
        <div className={styles.panel}>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Name</p>
            <input
              className={styles.formInput}
              maxLength={20}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isMinting}
            />
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Symbol</p>
            <input
              className={styles.formInput}
              maxLength={20}
              placeholder="Symbol"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              disabled={isMinting}
            />
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Description</p>
            <textarea
              className={cx(styles.formInput, styles.longInput)}
              maxLength={120}
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isMinting}
            />
          </div>

          {isMinting && (
            <div>
              <Stepper activeStep={currentMintingStep} alternativeLabel>
                {mintSteps.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          )}
          <div
            className={cx(
              styles.button,
              (isMinting || !isWalletConnected) && styles.disabled
            )}
            onClick={isMinting || !isWalletConnected ? null : mintNFT}
          >
            {isMinting ? (
              <ClipLoader size="16" color="white"></ClipLoader>
            ) : (
              'Mint'
            )}
          </div>
          <div className={styles.fee}>
            <InfoIcon />
            &nbsp;5 FTMs are charged to create a new NFT.
          </div>
          <div className={styles.mintStatusContainer}>
            {lastMintedTkId !== 0 && (
              <label className={styles.nftIDLabel}>
                You have created an NFT with ID of {lastMintedTkId}
              </label>
            )}

            {lastMintedTnxId !== '' && (
              <a
                className={styles.tnxAnchor}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://ftmscan.com/tx/${lastMintedTnxId}`}
              >
                You can track the last transaction here ...
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintBoard;
