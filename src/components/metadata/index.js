import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { ClipLoader } from 'react-spinners';

import 'react-notifications/lib/notifications.css';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

import { BigNumber } from 'ethers';

import { FantomNFTConstants } from '../../constants/smartcontracts/fnft.constants';
import SCHandlers from '../../utils/sc.interaction';
import IPFSConstants from '../../constants/ipfs.constants';
import SystemConstants from '../../constants/system.constants';
import { useSelector } from 'react-redux';

import WalletUtils from '../../utils/wallet';

const useStyles = makeStyles(() => ({
  container: {
    width: 400,
    height: 'fit-content',
    background: 'white',
    position: 'relative',
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
    marginTop: 40,
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

const assetCategories = [
  'Art',
  'Domain Names',
  'Virtual Words',
  'Trading Cards',
  'Collectibles',
  'Sports',
  'Utility',
  'New',
];

const mintSteps = [
  'Uploading to IPFS',
  'Create your NFT',
  'Confirming the Transaction',
];

const Metadata = () => {
  const classes = useStyles();

  const [name, setName] = useState('fAsset');
  const [symbol, setSymbol] = useState('newnft');
  const [royalty, setRoyalty] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Art');

  const [currentMintingStep, setCurrentMintingStep] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const [lastMintedTkId, setLastMintedTkId] = useState(0);
  const [lastMintedTnxId, setLastMintedTnxId] = useState('');

  let isWalletConnected = useSelector(state => state.ConnectWallet.isConnected);
  let connectedChainId = useSelector(state => state.ConnectWallet.chainId);
  let authToken = useSelector(state => state.ConnectWallet.authToken);
  const address = useSelector(state => state.ConnectWallet.address); //connected address

  const createNotification = (type, msgContent) => {
    switch (type) {
      case 'info':
        NotificationManager.info('Your asset has been successfully created');
        break;
      case 'success':
        NotificationManager.success(
          'Your asset has been successfully created',
          'Success'
        );
        break;
      case 'warning':
        NotificationManager.warning(
          'Warning message',
          'Close after 3000ms',
          3000
        );
        break;
      case 'custom':
        NotificationManager.info(msgContent);
        break;
      case 'error':
        NotificationManager.error(
          'Failed to create your asset',
          'Error',
          5000,
          () => {
            console.log('callback');
          }
        );
        break;
    }
  };

  const handleInputChange = (value, target) => {
    switch (target) {
      case 'name':
        {
          setName(value);
        }
        break;
      case 'royalty':
        {
          setRoyalty(value);
        }
        break;
      case 'description':
        {
          setDescription(value);
        }
        break;
      case 'category':
        {
          setCategory(value);
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
    return (
      name != '' &&
      symbol != '' &&
      royalty < 30 &&
      (category != '') & (address != '')
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
      createNotification('custom', 'Connect your wallet first');
      return;
    }
    if (connectedChainId != 4002) {
      createNotification('custom', 'You are not connected to Opera Testnet');
      return;
    }
    // only when the user has more than 1k ftms on the wallet
    let balance = await WalletUtils.checkBalance(address);

    if (balance < SystemConstants.FMT_BALANCE_LIMIT) {
      createNotification(
        'custom',
        `Your balance should be at least ${SystemConstants.FMT_BALANCE_LIMIT} ftm to mint an NFT`
      );
      return;
    }

    setLastMintedTkId(0);
    setLastMintedTnxId('');
    // show stepper
    setIsMinting(true);
    console.log('created from ', address);
    if (!validateMetadata()) {
      resetMintingStatus();
      return;
    }
    let canvas = document.getElementById('drawingboard');
    let formData = new FormData();
    formData.append('image', canvas.toDataURL());
    formData.append('name', name);
    formData.append('royalty', royalty);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('symbol', symbol);
    try {
      let result = await axios({
        method: 'post',
        url: 'https://nifty.fantom.network/api/ipfs/uploadImage2Server',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authToken,
        },
      });

      const jsonHash = result.data.jsonHash;
      const fileHash = result.data.fileHash;

      // let status = result.data.status;

      let fnft_sc = await SCHandlers.loadContract(
        FantomNFTConstants.TESTNETADDRESS,
        FantomNFTConstants.ABI
      );

      const provider = fnft_sc[1];
      fnft_sc = fnft_sc[0];

      try {
        let tx = await fnft_sc.mint(
          address,
          IPFSConstants.HashURI + jsonHash + '/',
          {
            gasLimit: 3000000,
          }
        );
        setCurrentMintingStep(1);
        // console.log('tnx is ', tx);
        setLastMintedTnxId(tx.hash);

        setCurrentMintingStep(2);
        const confirmedTnx = await provider.waitForTransaction(tx.hash);
        setCurrentMintingStep(3);
        // console.log('confirmed tnx is ', confirmedTnx);
        let evtCaught = confirmedTnx.logs[0].topics;
        let minterAddress = confirmedTnx.to;
        let mintedTkId = BigNumber.from(evtCaught[3]);
        setLastMintedTkId(mintedTkId.toNumber());
        let erc721tk = new FormData();
        erc721tk.append('contractAddress', minterAddress);
        erc721tk.append('tokenID', mintedTkId);
        erc721tk.append('symbol', symbol);
        erc721tk.append('royalty', royalty);
        erc721tk.append('category', category);
        erc721tk.append('imageHash', fileHash);
        erc721tk.append('jsonHash', jsonHash);

        try {
          let saveNewTKResult = await axios({
            method: 'post',
            url: 'https://nifty.fantom.network/api/erc721token/savenewtoken',
            data: erc721tk,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + authToken,
            },
          });
          let status = saveNewTKResult.status;
          switch (status) {
            case 'success':
              {
                resetMintingStatus();
                createNotification('info');
              }
              break;
            case 'failed':
              {
                resetMintingStatus();
                createNotification('error');
              }
              break;
            default: {
              resetMintingStatus();
              console.log('default status');
            }
          }
        } catch (error) {
          resetMintingStatus();
          createNotification('error');
        }
      } catch (error) {
        resetMintingStatus();
        createNotification('error');
      }
    } catch (error) {
      resetMintingStatus();
      createNotification('error');
    }
  };

  return (
    <div className={classes.container}>
      <NotificationContainer />
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
        />
        <TextField
          className={classes.inkMetadataInput}
          InputLabelProps={{
            className: classes.inkMetadataInputLabel,
          }}
          label="Royalties (%)"
          type="number"
          value={royalty}
          onChange={e => {
            handleInputChange(e.target.value, 'royalty');
          }}
          InputProps={{
            inputProps: {
              min: 1,
            },
          }}
        />
        <Autocomplete
          options={assetCategories}
          getOptionLabel={option => {
            handleInputChange(option, 'category');
            return option;
          }}
          value={category}
          className={classes.autocomplete}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.inkMetadataInput}
              InputLabelProps={{
                className: classes.inkMetadataInputLabel,
              }}
              label="Category"
            />
          )}
        />
        <TextField
          className={classes.inkMetadataInput}
          InputLabelProps={{
            className: classes.inkMetadataInputLabel,
          }}
          label="Description(Optional)"
          style={{ textAlign: 'left' }}
          hinttext="Message Field"
          defaultValue={description}
          floatinglabeltext="MultiLine and FloatingLabel"
          multiline
          rows={4}
          onChange={e => {
            handleInputChange(e.target.value, 'description');
          }}
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
            rel="noreferrer"
            href={
              'https://explorer.testnet.fantom.network/transactions/' +
              lastMintedTnxId
            }
          >
            You can track the last transaction here ...
          </a>
        )}
      </div>
    </div>
  );
};

export default Metadata;
