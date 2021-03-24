import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { ClipLoader } from 'react-spinners';

import ImageIcon from '@material-ui/icons/Image';

import 'react-notifications/lib/notifications.css';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

import './styles.css';
import { BigNumber } from 'ethers';

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
  createCollectionDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 'x-large',
    // borderTop: '1px dotted #007bff',
    marginTop: '20px',
  },
  createCollectionContainer: {
    width: '24%',
  },
  createCollectionBtn: {
    marginTop: '30px',
    width: '30%',
    letterSpacing: '11px',
    fontFamily: 'monospace',
    fontSize: 'x-large',
    backgroundColor: '#007bff !important',
    margin: '0 0 24px 0',
    height: '50px',
  },
  createCollectionImgContainer: {
    height: '240px',
    marginBottom: '36px',
  },
  createCollectionImageBox: {
    width: '240px',
    height: '100%',
    border: '3px dotted gray',
  },
  createCollectionDlgTitle: {
    textAlign: 'center',
  },
  createCollectionLogo: {
    marginBottom: '36px',
  },
  createCollectionNameInputDiv: {
    marginBottom: '36px',
  },
  createCollectionNameInput: {
    width: '100%',
    textAlign: 'left',
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

  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isCollectionLogoUploaded, setIsCollectionLogoUploaded] = useState(
    false
  );
  const [collectionLogoUrl, setCollectioLogoUrl] = useState('');
  const [isCreateCollectionShown, setIsCreateCollectionShown] = useState(false);

  const [collectionImgData, setCollectionImgData] = useState(null);

  const [fileSelector, setFileSelector] = useState();

  useEffect(() => {
    let _fileSelector = document.createElement('input');
    _fileSelector.setAttribute('type', 'file');
    _fileSelector.setAttribute('accept', '.png');
    _fileSelector.addEventListener('change', () => {
      try {
        let selected = _fileSelector.files[0];
        let url = URL.createObjectURL(selected);
        setCollectioLogoUrl(url);
        console.log('created url is ', url);
        let reader = new FileReader();
        reader.readAsDataURL(selected);
        reader.onloadend = () => {
          let background = new Image();
          background.src = reader.result;
          background.onload = () => {
            setCollectionImgData(background.src);
            console.log(background.src);
            setIsCollectionLogoUploaded(true);
            _fileSelector.value = null;
          };
        };
      } catch (error) {
        console.log('file selection cancelled');
      }
    });
    setFileSelector(_fileSelector);
  }, []);

  let isWalletConnected = useSelector(state => state.ConnectWallet.isConnected);
  let connectedChainId = useSelector(state => state.ConnectWallet.chainId);
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
      case 'collectionName':
        {
          setCollectionName(value);
        }
        break;
      case 'collectionDescription':
        {
          setCollectionDescription(value);
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

  const uploadImageForCollection = () => {
    fileSelector.click();
  };

  const toggleCreateCollectionDlg = async () => {
    console.log('clicked');
    let balance = await SCHandlers.getAccountBalance(address);
    console.log(`total balance of ${address} is ${balance}`);
    if (!isWalletConnected) {
      createNotification('custom', 'Connect your wallet first');
      return;
    }
    if (connectedChainId != 4002) {
      createNotification('custom', 'You are not connected to Opera Testnet');
      return;
    }
    setIsCreateCollectionShown(true);
  };

  const handleCreateCollection = async () => {
    if (collectionLogoUrl == '') {
      createNotification('custom', 'You need to upload the collection logo');
      return;
    }
    let formData = new FormData();
    formData.append('name', collectionName);
    formData.append('description', collectionDescription);
    formData.append('address', address);
    formData.append('imgData', collectionImgData);
    try {
      let result = await axios({
        method: 'post',
        url:
          'https://nifty.fantom.network/api/ipfs/uploadCollectionImage2Server',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(result);
    } catch (error) {
      console.log('failed to upload to the server');
    }
    setCollectionName('');
    setCollectionDescription('');
    setIsCollectionLogoUploaded(false);
    setCollectioLogoUrl('');
    setIsCreateCollectionShown(false);
    setCollectionImgData(null);
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
            disabled={isMinting || !isWalletConnected}
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
      <div className={classes.createCollectionDiv}>
        <div>
          By creating a collection, you can group a set of NFTs and sell with a
          single tap.
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.createCollectionBtn}
          onClick={async () => {
            await toggleCreateCollectionDlg();
          }}
          disabled={!isWalletConnected}
        >
          Create
        </Button>
      </div>
      {isCreateCollectionShown && (
        <div>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            // maxWidth="xs"
            classes={{
              paper: classes.createCollectionContainer,
            }}
            onEntering={() => {}}
            aria-labelledby="confirmation-dialog-title"
            open={true}
          >
            <DialogTitle id="confirmation-dialog-title">
              <div className={classes.createCollectionDlgTitle}>
                Create your collection
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <div>
                <div className={classes.createCollectionLogo}>
                  <p>Logo</p>
                  <p>(350 x 350 recommended)</p>
                </div>
                <div className={classes.createCollectionImgContainer}>
                  <div
                    className={classes.createCollectionImageBox}
                    onClick={uploadImageForCollection}
                  >
                    {isCollectionLogoUploaded ? (
                      <img
                        src={collectionLogoUrl}
                        alt="icon"
                        className={classes.collectionLogoImage}
                      ></img>
                    ) : (
                      <ImageIcon
                        viewBox="-10 -10 44 44"
                        className={classes.creteCollectionImageIcon}
                      ></ImageIcon>
                    )}
                  </div>
                </div>
              </div>
              <div className={classes.createCollectionNameInput}>
                <TextField
                  label="Name"
                  id="inkmetadatasymbolinput"
                  className={classes.createCollectionNameInput}
                  placeholder="e.g.FMT Gems"
                  value={collectionName}
                  onChange={e => {
                    handleInputChange(e.target.value, 'collectionName');
                  }}
                />
              </div>
              <div>
                <TextField
                  label="description(Optional)"
                  hinttext="Message Field"
                  value={collectionDescription}
                  placeholder="Provide a description for your collection."
                  floatinglabeltext="MultiLine and FloatingLabel"
                  className={classes.createCollectionNameInput}
                  multiline
                  rows={2}
                  onChange={e => {
                    handleInputChange(e.target.value, 'collectionDescription');
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  setIsCreateCollectionShown(false);
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCollection} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Metadata;
