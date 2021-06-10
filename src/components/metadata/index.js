import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useWeb3React } from '@web3-react/core';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { ClipLoader } from 'react-spinners';
import InfoIcon from '@material-ui/icons/Info';

import { BigNumber, ethers } from 'ethers';

import { FantomNFTConstants } from 'constants/smartcontracts/fnft.constants';
import SCHandlers from 'utils/sc.interaction';
import SystemConstants from 'constants/system.constants';

import toast from 'utils/toast';
import WalletUtils from 'utils/wallet';
import { calculateGasMargin } from 'utils';
import { API_URL } from 'api';

const useStyles = makeStyles(() => ({
  container: {
    width: 400,
    height: 'fit-content',
    background: 'white',
    position: 'relative',
    marginTop: -40,
  },
  inkMetadataInput: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
    padding: '0 22px 12px',
    marginBottom: 20,
  },
  inkMetadataInputLabel: {
    left: 22,
  },
  inkButton: {
    width: '60%',
    letterSpacing: 5,
    fontSize: 20,
    backgroundColor: '#007bff !important',
    color: '#fff !important',
    margin: '0 20% 24px',
    height: 48,
    cursor: 'pointer',

    '&:disabled': {
      color: '#fffa !important',
    },
  },
  fee: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3D3D3D',
    opacity: 0.6,
  },
  autocomplete: {
    width: '100%',
    backgroundColor: '#ffffff !important',
    background: 'transparent !important',
  },

  mintStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'x-large',
    position: 'absolute',
    width: '100%',
  },
  nftIDLabel: {
    fontSize: 18,
    color: '#A5A5A5',
  },
  tnxAnchor: {
    textDecoration: 'unset',
    fontSize: 18,
    marginTop: '18px',
    color: '#007bff',
  },
  creteCollectionImageIcon: {
    width: 'unset !important',
    height: 'unset !important',
  },
  collectionLogoImage: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
}));

const mintSteps = [
  'Uploading to IPFS',
  'Create your NFT',
  'Confirming the Transaction',
];

const Metadata = () => {
  const classes = useStyles();

  const { account, chainId } = useWeb3React();

  const [name, setName] = useState('fAsset');
  const [symbol, setSymbol] = useState('newnft');
  const [description, setDescription] = useState('');

  const [currentMintingStep, setCurrentMintingStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const [lastMintedTkId, setLastMintedTkId] = useState(0);
  const [lastMintedTnxId, setLastMintedTnxId] = useState('');

  let isWalletConnected = useSelector(state => state.ConnectWallet.isConnected);
  let authToken = useSelector(state => state.ConnectWallet.authToken);

  const resetBoard = () => {
    const canvas = document.getElementById('drawingboard');
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    const canvasBg = document.getElementById('drawingbg');
    if (canvasBg) {
      const context = canvasBg.getContext('2d');
      context.clearRect(0, 0, canvasBg.width, canvasBg.height);
    }
  };

  const handleInputChange = (value, target) => {
    switch (target) {
      case 'name':
        {
          setName(value);
        }
        break;
      case 'description':
        {
          setDescription(value);
        }
        break;
      case 'symbol':
        {
          setSymbol(value);
        }
        break;
      default: {
        console.log('default');
      }
    }
  };

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
      toast('info', 'Connect your wallet first');
      return;
    }
    if (chainId != 250) {
      toast('info', 'You are not connected to Fantom Opera Network');
      return;
    }
    // only when the user has more than 1k ftms on the wallet
    let balance = await WalletUtils.checkBalance(account);

    if (balance < SystemConstants.FMT_BALANCE_LIMIT) {
      toast(
        'custom',
        `Your balance should be at least ${SystemConstants.FMT_BALANCE_LIMIT} ftm to mint an NFT`
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
    const canvasBg = document.getElementById('drawingbg');
    const canvas = document.getElementById('drawingboard');

    const newcanvas = document.createElement('canvas');
    newcanvas.width = canvas.clientWidth;
    newcanvas.height = canvas.clientHeight;
    const ctx = newcanvas.getContext('2d');
    const image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0);

      const image1 = new Image();
      image1.onload = async function() {
        ctx.drawImage(image1, 0, 0);

        let formData = new FormData();
        formData.append('image', newcanvas.toDataURL());
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
              value: ethers.utils.parseEther('2'),
            };
            const gasEstimate = await fnft_sc.estimateGas.mint(
              ...args,
              options
            );
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

            toast('success', 'New NFT item minted!');
            resetBoard();
            setName('fAsset');
            setSymbol('newnft');
            setDescription('');
          } catch (error) {
            toast('error', error.message);
          }
        } catch (error) {
          toast('error', error.message);
        }
        resetMintingStatus();
      };
      image1.src = canvas.toDataURL();
    };
    image.src = canvasBg.toDataURL();
  };

  return (
    <div className={classes.container}>
      <div>
        <TextField
          className={classes.inkMetadataInput}
          InputLabelProps={{
            className: classes.inkMetadataInputLabel,
          }}
          label="Name"
          value={name}
          onChange={e => {
            handleInputChange(e.target.value, 'name');
          }}
          disabled={isMinting}
        />
        <TextField
          className={classes.inkMetadataInput}
          InputLabelProps={{
            className: classes.inkMetadataInputLabel,
          }}
          label="Symbol"
          value={symbol}
          onChange={e => {
            handleInputChange(e.target.value, 'symbol');
          }}
          disabled={isMinting}
        />
        <TextField
          className={classes.inkMetadataInput}
          InputLabelProps={{
            className: classes.inkMetadataInputLabel,
          }}
          label="Description(Optional)"
          style={{ textAlign: 'left' }}
          hinttext="Message Field"
          value={description}
          floatinglabeltext="MultiLine and FloatingLabel"
          multiline
          rows={4}
          onChange={e => {
            handleInputChange(e.target.value, 'description');
          }}
          disabled={isMinting}
        />

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
        <Button
          variant="contained"
          color="primary"
          className={classes.inkButton}
          onClick={mintNFT}
          disabled={isMinting || !isWalletConnected}
        >
          {isMinting ? (
            <ClipLoader size="16" color="white"></ClipLoader>
          ) : (
            'MINT'
          )}
        </Button>
        <div className={classes.fee}>
          <InfoIcon />
          &nbsp;2 FTMs are charged to create a new NFT.
        </div>
      </div>
      <div className={classes.mintStatusContainer}>
        {lastMintedTkId !== 0 && (
          <label className={classes.nftIDLabel}>
            You have created an NFT with ID of {lastMintedTkId}
          </label>
        )}

        {lastMintedTnxId !== '' && (
          <a
            className={classes.tnxAnchor}
            target="_blank"
            rel="noopener noreferrer"
            href={`https://ftmscan.com/tx/${lastMintedTnxId}`}
          >
            You can track the last transaction here ...
          </a>
        )}
      </div>
    </div>
  );
};

export default Metadata;
