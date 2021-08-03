import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useDropzone } from 'react-dropzone';
import Skeleton from 'react-loading-skeleton';
import { ChainId } from '@sushiswap/sdk';
import Select from 'react-dropdown-select';

import CloseIcon from '@material-ui/icons/Close';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InfoIcon from '@material-ui/icons/Info';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import BootstrapTooltip from 'components/BootstrapTooltip';
import { calculateGasMargin } from 'utils';
import showToast from 'utils/toast';
import WalletUtils from 'utils/wallet';
import useContract from 'utils/sc.interaction';
import { useApi } from 'api';
import { useSalesContract } from 'contracts';
import { FantomNFTConstants } from 'constants/smartcontracts/fnft.constants';

import styles from './styles.module.scss';

const accept = ['image/*'];

const mintSteps = [
  'Uploading to IPFS',
  'Create your NFT',
  'Confirming the Transaction',
];

const PaintBoard = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { explorerUrl, apiUrl, fetchMintableCollections } = useApi();
  const { registerRoyalty } = useSalesContract();
  const { loadContract } = useContract();

  const { account, chainId } = useWeb3React();

  const imageRef = useRef();

  const [selected, setSelected] = useState([]);
  const [collections, setCollections] = useState([]);
  const [nft, setNft] = useState();
  const [image, setImage] = useState(null);
  const [fee, setFee] = useState(null);

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [royalty, setRoyalty] = useState(0);
  const [xtra, setXtra] = useState('');

  const [currentMintingStep, setCurrentMintingStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const [lastMintedTnxId, setLastMintedTnxId] = useState('');

  const isWalletConnected = useSelector(
    state => state.ConnectWallet.isConnected
  );
  const authToken = useSelector(state => state.ConnectWallet.authToken);

  const getFee = async () => {
    setFee(null);

    try {
      const contract = await loadContract(nft, FantomNFTConstants.ABI);
      const _fee = await contract.platformFee();
      setFee(parseFloat(_fee.toString()) / 10 ** 18);
    } catch {
      setFee(0);
    }
  };

  const getCollections = async () => {
    try {
      const { data } = await fetchMintableCollections(authToken);
      setCollections(data);
      setSelected([data[0]]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!chainId) return;

    setNft(FantomNFTConstants.ADDRESS[chainId]);
  }, [chainId]);

  useEffect(() => {
    if (authToken) {
      getCollections();
    }
  }, [authToken]);

  useEffect(() => {
    if (!nft) return;

    getFee();
  }, [nft]);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

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

  const validateMetadata = () => {
    return name !== '' && account !== '' && image;
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
    if (chainId !== ChainId.FANTOM && chainId !== ChainId.FANTOM_TESTNET) {
      showToast('info', 'You are not connected to Fantom Opera Network');
      return;
    }
    const balance = await WalletUtils.checkBalance(account);

    if (balance < fee) {
      showToast(
        'custom',
        `Your balance should be at least ${fee} FTM to mint an NFT`
      );
      return;
    }

    setLastMintedTnxId('');
    // show stepper
    setIsMinting(true);
    console.log('created from ', account);
    if (!validateMetadata()) {
      resetMintingStatus();
      return;
    }

    let formData = new FormData();
    const base64 = await imageToBase64();
    formData.append('image', base64);
    formData.append('name', name);
    formData.append('account', account);
    formData.append('description', description);
    formData.append('symbol', symbol);
    formData.append('xtra', xtra);
    const _royalty = parseInt(royalty);
    formData.append('royalty', isNaN(_royalty) ? 0 : _royalty);
    try {
      let result = await axios({
        method: 'post',
        url: `${apiUrl()}/ipfs/uploadImage2Server`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      });

      console.log('upload image result is ');
      console.log(result);

      const jsonHash = result.data.jsonHash;

      const contract = await loadContract(nft, FantomNFTConstants.ABI);

      try {
        const args = [account, jsonHash];

        let tx;
        if (!fee) {
          tx = await contract.mint(...args);
        } else {
          const options = {
            value: ethers.utils.parseEther(fee.toString()),
          };
          const gasEstimate = await contract.estimateGas.mint(...args, options);
          options.gasLimit = calculateGasMargin(gasEstimate);
          tx = await contract.mint(...args, options);
        }
        setCurrentMintingStep(1);
        setLastMintedTnxId(tx.hash);

        setCurrentMintingStep(2);
        const confirmedTnx = await tx.wait();
        setCurrentMintingStep(3);
        const evtCaught = confirmedTnx.logs[0].topics;
        const mintedTkId = BigNumber.from(evtCaught[3]);

        const royaltyTx = await registerRoyalty(
          nft,
          mintedTkId.toNumber(),
          isNaN(_royalty) ? 0 : _royalty
        );
        await royaltyTx.wait();

        showToast('success', 'New NFT item minted!');
        removeImage();
        setName('');
        setSymbol('');
        setDescription('');

        setTimeout(() => {
          history.push(`/explore/${nft}/${mintedTkId.toNumber()}`);
        }, 1000 + Math.random() * 2000);
      } catch (error) {
        showToast('error', error.message);
      }
    } catch (error) {
      showToast('error', error.message);
    }
    resetMintingStatus();
  };

  return (
    <div className={styles.container}>
      <Header light />
      <div className={styles.body}>
        <div className={styles.board}>
          <div {...getRootProps({ className: styles.uploadCont })}>
            <input {...getInputProps()} ref={imageRef} />
            {image ? (
              <>
                <img
                  className={styles.image}
                  src={URL.createObjectURL(image)}
                />
                <div className={styles.overlay}>
                  <CloseIcon className={styles.remove} onClick={removeImage} />
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
                  JPG, PNG, BMP, GIF Max 15mb.
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Collection</p>
            <Select
              options={collections}
              disabled={isMinting}
              values={selected}
              onChange={([col]) => {
                setSelected([col]);
                setNft(col.erc721Address);
              }}
              className={styles.select}
              placeholder="Choose Collection"
              itemRenderer={({ item, methods }) => (
                <div
                  key={item.erc721Address}
                  className={styles.collection}
                  onClick={() => {
                    methods.clearAll();
                    methods.addItem(item);
                  }}
                >
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${item.logoImageHash}`}
                    className={styles.collectionLogo}
                  />
                  <div className={styles.collectionName}>
                    {item.collectionName}
                  </div>
                </div>
              )}
              contentRenderer={({ props: { values } }) =>
                values.length > 0 ? (
                  <div className={styles.collection}>
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${values[0].logoImageHash}`}
                      className={styles.collectionLogo}
                    />
                    <div className={styles.collectionName}>
                      {values[0].collectionName}
                    </div>
                  </div>
                ) : (
                  <div className={styles.collection} />
                )
              }
            />
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Name</p>
            <input
              className={styles.formInput}
              maxLength={40}
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isMinting}
            />
            <div className={styles.lengthIndicator}>{name.length}/40</div>
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
            <div className={styles.lengthIndicator}>{symbol.length}/20</div>
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
            <div className={styles.lengthIndicator}>
              {description.length}/120
            </div>
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>
              Royalty (%)&nbsp;
              <BootstrapTooltip
                title="If you set a royalty here, you will get X percent of sales price each time an NFT is sold on our platform."
                placement="top"
              >
                <HelpOutlineIcon />
              </BootstrapTooltip>
            </p>
            <input
              className={styles.formInput}
              type="number"
              min={0}
              max={100}
              placeholder="Royalty"
              value={royalty}
              onChange={e => {
                const val = e.target.value;
                if (!isNaN(val)) {
                  const _royalty = parseInt(val);
                  setRoyalty(Math.max(Math.min(_royalty, 100), 0));
                }
              }}
              disabled={isMinting}
            />
          </div>
          <div className={styles.formGroup}>
            <p className={styles.formLabel}>Link to IP Rights Document</p>
            <input
              className={styles.formInput}
              placeholder="Enter Link"
              value={xtra}
              onChange={e => setXtra(e.target.value)}
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
            {fee !== null ? (
              <>
                <InfoIcon />
                &nbsp;{fee} FTMs are charged to create a new NFT.
              </>
            ) : (
              <Skeleton width={330} height={22} />
            )}
          </div>
          <div className={styles.mintStatusContainer}>
            {lastMintedTnxId !== '' && (
              <a
                className={styles.tnxAnchor}
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl()}/tx/${lastMintedTnxId}`}
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
