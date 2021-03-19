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

import './styles.css';
import { BigNumber, ethers } from 'ethers';

import { FantomNFTConstants } from '../../constants/smartcontracts/fnft.constants';
import SCHandlers from '../../utils/sc.interaction';
import IPFSConstants from '../../constants/ipfs.constants';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  container: {
    width: '40%',
    height: '80%',
    background: 'white',
    position: 'fixed',
    right: '36px',
    top: '12%',
  },
  inkContainer: {
    borderBottom: '1px dotted blue',
  },
  inkMetadataInput: {
    margin: '24px',
    backgroundColor: '#ffffff !important',
    background: 'transparent !important',
  },
  inkButton: {
    width: '30%',
    letterSpacing: '11px',
    fontFamily: 'monospace',
    fontSize: 'x-large',
    backgroundColor: '#007bff !important',
    margin: '0 0 24px 0',
    height: '50px',
  },
  inkInputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inkButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inkDescriptionContainer: {
    marginTop: '40px',
    marginBottom: '40px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  autocomplete: {
    width: '200px',
    backgroundColor: '#ffffff !important',
    background: 'transparent !important',
  },

  mintStatusContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'x-large',
    marginTop: '60px',
  },
  nftIDLabel: {
    marginTop: '20px',
  },
  tnxAnchor: {
    textDecoration: 'unset',
    marginTop: '18px',
    color: '#007bff',
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

  const validateMetadata = address => {
    return (
      name != '' &&
      symbol != '' &&
      royalty < 30 &&
      (category != '') & (address != '')
    );
  };

  const connectWallet = async () => {
    await window.ethereum.enable();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let accounts = await provider.listAccounts();
    return accounts[0];
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
    setLastMintedTkId(0);
    setLastMintedTnxId('');
    // show stepper
    setIsMinting(true);

    let address = await connectWallet();
    console.log('created from ', address);
    if (!validateMetadata(address)) {
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
        url: 'http://54.174.183.104:4101/ipfs/uploadImage2Server',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const jsonHash = result.data.jsonHash;

      let status = result.data.status;

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
        console.log('tnx is ', tx);
        setLastMintedTnxId(tx.hash);

        setCurrentMintingStep(2);
        const confirmedTnx = await provider.waitForTransaction(tx.hash);
        setCurrentMintingStep(3);
        console.log('confirmed tnx is ', confirmedTnx);
        let evtCaught = confirmedTnx.logs[0].topics;

        let mintedTkId = BigNumber.from(evtCaught[3]);
        setLastMintedTkId(mintedTkId.toNumber());
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
  };

  return (
    <div className={classes.container}>
      <NotificationContainer />
      <div className={classes.inkContainer}>
        <div className={classes.inkInputContainer}>
          <TextField
            className={classes.inkMetadataInput}
            label="Name"
            id="inkmetadatanameinput"
            value={name}
            onChange={e => {
              handleInputChange(e.target.value, 'name');
            }}
          />
          <TextField
            className={classes.inkMetadataInput}
            label="Symbol"
            id="inkmetadatasymbolinput"
            value={symbol}
            onChange={e => {
              handleInputChange(e.target.value, 'symbol');
            }}
          />
          <TextField
            className={classes.inkMetadataInput}
            label="Royalties (%)"
            type="number"
            id="inkmetadatalimitinput"
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
            id="category-combo-box"
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
                label="Categories"
                id="inkmetadatacategoryinput"
              />
            )}
          />
        </div>
        <div className={classes.inkDescriptionContainer}>
          <TextField
            label="description(Optional)"
            style={{ textAlign: 'left' }}
            hinttext="Message Field"
            defaultValue={description}
            floatinglabeltext="MultiLine and FloatingLabel"
            multiline
            rows={2}
            onChange={e => {
              handleInputChange(e.target.value, 'description');
            }}
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
        <div className={classes.inkButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.inkButton}
            onClick={mintNFT}
            disabled={isMinting}
          >
            {isMinting ? (
              <ClipLoader size="16" color="white"></ClipLoader>
            ) : (
              'MINT'
            )}
          </Button>
        </div>
      </div>
      <div className={classes.mintStatusContainer}>
        {lastMintedTkId != 0 && (
          <label className={classes.nftIDLabel}>
            You have created an NFT with ID of {lastMintedTkId}
          </label>
        )}

        {lastMintedTnxId != '' && (
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
