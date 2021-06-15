import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useDropzone } from 'react-dropzone';

import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InfoIcon from '@material-ui/icons/Info';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import ImageEditor from 'components/ImageEditor';
import MintModeModal from 'components/MintModeModal';
import { calculateGasMargin } from 'utils';
import showToast from 'utils/toast';
import WalletUtils from 'utils/wallet';
import SCHandlers from 'utils/sc.interaction';
import { API_URL } from 'api';
import { FantomNFTConstants } from 'constants/smartcontracts/fnft.constants';
import useWindowDimensions from 'hooks/useWindowDimensions';

import whiteTheme from './white-theme';

import transparentBackground from './transparent.png';

import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import styles from './styles.module.scss';

const accept = ['image/*'];

const mintSteps = [
  'Uploading to IPFS',
  'Create your NFT',
  'Confirming the Transaction',
];

const PaintBoard = () => {
  const dispatch = useDispatch();

  const { account, chainId } = useWeb3React();

  const ref = useRef();
  const imageRef = useRef();

  const [modeSelecting, setModeSelecting] = useState(false);
  const [mode, setMode] = useState(0);
  const [imageEditor, setImageEditor] = useState(null);
  const [image, setImage] = useState(null);
  const { width } = useWindowDimensions();

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

  const init = () => {
    if (width > 1150) {
      setModeSelecting(true);
    }
  };

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
    init();
  }, []);

  useEffect(() => {
    if (ref.current) {
      setImageEditor(ref.current.getInstance());
    }
  }, [ref.current]);

  const onDrop = useCallback(acceptedFiles => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: accept.join(', '),
    multiple: false,
    onDrop,
    maxSize: 15728640,
  });

  const removeImage = () => {
    setImage(null);
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const imageToBase64 = () => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = err => {
        reject(err);
      };
    });
  };

  const resetBoard = () => {
    if (!imageEditor) return;

    imageEditor.loadImageFromURL(transparentBackground, 'image');
  };

  const validateMetadata = () => {
    return (
      name !== '' &&
      symbol !== '' &&
      account !== '' &&
      (mode === 0 ? image : imageEditor?.toDataURL())
    );
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
    if (mode === 0) {
      const base64 = await imageToBase64();
      formData.append('image', base64);
    } else {
      formData.append('image', imageEditor.toDataURL());
    }
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
        resetBoard();
        removeImage();
        setName('');
        setSymbol('');
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
      loadImage: {
        path: transparentBackground,
        name: 'image',
      },
      theme: whiteTheme,
      menuBarPosition: 'right',
      uiSize: {
        height: '100%',
        width: '100%',
      },
      draw: {
        color: '#00a9ff',
        opacity: 1.0,
      },
    },
    cssMaxWidth: 512,
    cssMaxHeight: 512,
  };

  return (
    <div className={styles.container}>
      <Header light onCreate={init} />
      <div className={styles.body}>
        {mode === 0 || width > 1150 ? (
          <>
            <div className={styles.board}>
              {mode === 0 ? (
                <div {...getRootProps({ className: styles.uploadCont })}>
                  <input {...getInputProps()} ref={imageRef} />
                  {image ? (
                    <>
                      <img
                        className={styles.image}
                        src={URL.createObjectURL(image)}
                      />
                      <div className={styles.overlay}>
                        <CloseIcon
                          className={styles.remove}
                          onClick={removeImage}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.uploadtitle}>
                        Drop files here or&nbsp;
                        <span
                          className={styles.browse}
                          onClick={() => imageRef.current?.click()}
                        >
                          browse
                        </span>
                      </div>
                      <div className={styles.uploadsubtitle}>
                        PNG, GIF Max 30mb.
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <ImageEditor ref={ref} {...options} />
              )}
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
                  (isMinting || !isWalletConnected || !validateMetadata()) &&
                    styles.disabled
                )}
                onClick={
                  isMinting || !isWalletConnected || !validateMetadata()
                    ? null
                    : mintNFT
                }
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
          </>
        ) : (
          <div className={styles.warning}>
            <WarningIcon className={styles.warningIcon} />
            <div className={styles.warningTitle}>
              Can not edit image on small screens!
            </div>
            <div className={styles.switchButton} onClick={() => setMode(0)}>
              Switch Mode
            </div>
          </div>
        )}
      </div>
      <MintModeModal
        visible={modeSelecting}
        onModeSelect={_mode => {
          setMode(_mode);
          setModeSelecting(false);
        }}
      />
    </div>
  );
};

export default PaintBoard;
