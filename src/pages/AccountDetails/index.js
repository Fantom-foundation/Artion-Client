import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import axios from 'axios';
import cx from 'classnames';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import PublishIcon from '@material-ui/icons/Publish';
import { useWeb3React } from '@web3-react/core';

import NFTsGrid from '../../components/NFTsGrid';
import StatusFilter from '../../components/StatusFilter';
import CollectionsFilter from '../../components/CollectionsFilter';
import SCHandlers from '../../utils/sc.interaction';
import { shortenAddress } from 'utils';
import { getUserAccountDetails, fetchTokens } from 'api';
import TokensActions from 'actions/tokens.actions';

import styles from './styles.module.scss';

const AccountDetails = () => {
  const dispatch = useDispatch();

  const { account, chainId } = useWeb3React();

  const { uid } = useParams();

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  let isWalletConnected = useSelector(state => state.ConnectWallet.isConnected);
  const { collections, category } = useSelector(state => state.Filter);
  const { user: me } = useSelector(state => state.Auth);

  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isCollectionLogoUploaded, setIsCollectionLogoUploaded] = useState(
    false
  );
  const [collectionLogoUrl, setCollectioLogoUrl] = useState('');
  const [collectionImgData, setCollectionImgData] = useState(null);
  const [isCreateCollectionShown, setIsCreateCollectionShown] = useState(false);
  const [bundleIndex, setBundleIndex] = useState(null);

  const [fileSelector, setFileSelector] = useState();

  const [page, setPage] = useState(0);
  const [user, setUser] = useState({});

  const getUserDetails = async account => {
    try {
      const { data } = await getUserAccountDetails(account);
      setUser(data);
    } catch {
      setUser({});
    }
  };

  const fetchNFTs = async step => {
    dispatch(TokensActions.startFetching());

    try {
      const { data } = await fetchTokens(step, collections, category, uid);
      dispatch(TokensActions.fetchingSuccess(data.total, data.tokens));
      setPage(step);
    } catch {
      dispatch(TokensActions.fetchingFailed());
    }
  };

  useEffect(() => {
    getUserDetails(uid);
  }, [uid]);

  useEffect(() => {
    if (account === uid && me.alias) {
      setUser(me);
    }
  }, [me]);

  const handleScroll = e => {
    if (fetching) return;
    if (tokens.length === count) return;

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 50) {
      fetchNFTs(page + 1);
    }
  };

  useEffect(() => {
    dispatch(TokensActions.resetTokens());
    fetchNFTs(0);
  }, [collections, category, uid]);

  useEffect(() => {
    let _fileSelector = document.createElement('input');
    _fileSelector.setAttribute('type', 'file');
    _fileSelector.setAttribute('accept', 'image/*');
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

  const bundles = Array.from({ length: 10 }, (_, index) => ({
    logo:
      'https://lh3.googleusercontent.com/Cl3eJW9mEGZaSF0xxLIM0SzUx9HDi3Tgns5mHEKMtEokOmgtrrqLPZidxvM8BXBjzEWc03BNwzpXqEpc4w0sVOFnDlSeeFsh_ia6zg=s100',
    name: `Bundle ${index + 1}`,
  }));

  const onBundleSelect = index => {
    if (bundleIndex === index) {
      setBundleIndex(null);
    } else {
      setBundleIndex(index);
    }
  };

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

  const openCreateBundleModal = async () => {
    let balance = await SCHandlers.getAccountBalance(account);
    console.log(`total balance of ${account} is ${balance}`);
    if (!isWalletConnected) {
      createNotification('custom', 'Connect your wallet first');
      return;
    }
    if (chainId != 4002) {
      createNotification('custom', 'You are not connected to Opera Testnet');
      return;
    }
    setIsCreateCollectionShown(true);
  };

  const uploadImageForCollection = () => {
    fileSelector.click();
  };

  const handleCreateBundle = async () => {
    if (collectionLogoUrl == '') {
      createNotification('custom', 'You need to upload the collection logo');
      return;
    }
    let formData = new FormData();
    formData.append('name', collectionName);
    formData.append('description', collectionDescription);
    formData.append('account', account);
    formData.append('imgData', collectionImgData);
    try {
      let result = await axios({
        method: 'post',
        url: 'https://fmarket.fantom.network/api/ipfs/uploadBundleImage2Server',
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
    <div className={styles.container}>
      <NotificationContainer />
      <div className={styles.sidebar}>
        <div className={styles.profileWrapper}>
          <img
            src={
              user.imageHash
                ? `https://gateway.pinata.cloud/ipfs/${user.imageHash}`
                : 'https://lh3.googleusercontent.com/ojVpeYTZbASHsP-9z385kSIQSAHYaNFZkVMgiU4j6djSmRDtyc0psef3vy1LVoyREFDHSY7VzqQKiqYoJo9teMOxcvoCdlkatucflw=s0'
            }
            className={styles.avatar}
          />
          <div className={styles.username}>{user.alias || ''}</div>
          <a
            href={`https://ftmscan.com/account/${uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.account}
          >
            {shortenAddress(uid)}
          </a>
          <div className={styles.bio}>{user.bio || ''}</div>
        </div>
        <StatusFilter />
        <CollectionsFilter />
      </div>

      <div className={styles.body} onScroll={handleScroll}>
        <div className={styles.bundleBox}>
          <div className={styles.bundleList}>
            {bundles.map((bundle, idx) => (
              <div
                className={cx(
                  styles.bundle,
                  idx === bundleIndex ? styles.selected : null
                )}
                key={idx}
                onClick={() => onBundleSelect(idx)}
              >
                <img src={bundle.logo} className={styles.bundleLogo} />
                {bundle.name}
              </div>
            ))}
            <div className={styles.bundle} onClick={openCreateBundleModal}>
              <AddIcon />
            </div>
          </div>
        </div>
        <NFTsGrid items={tokens} loading={fetching} />
      </div>

      {isCreateCollectionShown && (
        <div>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            classes={{
              paper: styles.createCollectionContainer,
            }}
            aria-labelledby="confirmation-dialog-title"
            open={true}
          >
            <DialogTitle id="confirmation-dialog-title">
              <div className={styles.createCollectionDlgTitle}>
                Create your bundle
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <div>
                <div className={styles.createCollectionLogo}>
                  <p>Logo</p>
                  <p>(350 x 350 recommended)</p>
                </div>
                <div className={styles.createCollectionImgContainer}>
                  <div className={styles.createCollectionImageBox}>
                    {isCollectionLogoUploaded ? (
                      <img
                        src={collectionLogoUrl}
                        alt="icon"
                        className={styles.collectionLogoImage}
                      ></img>
                    ) : null}
                    <div
                      className={styles.uploadOverlay}
                      onClick={uploadImageForCollection}
                    >
                      <PublishIcon className={styles.uploadIcon} />
                    </div>
                  </div>
                </div>
              </div>
              <TextField
                label="Name"
                className={styles.createCollectionNameInput}
                InputLabelProps={{
                  className: styles.createCollectionNameInputLabel,
                }}
                placeholder="e.g.FMT Gems"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
              />
              <TextField
                label="Description (Optional)"
                hinttext="Message Field"
                value={collectionDescription}
                placeholder="Provide a description for your collection."
                floatinglabeltext="MultiLine and FloatingLabel"
                className={styles.createCollectionNameInput}
                InputLabelProps={{
                  className: styles.createCollectionNameInputLabel,
                }}
                multiline
                rows={2}
                onChange={e => setCollectionDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCreateBundle}
                className={styles.createButton}
              >
                Create
              </Button>
              <Button
                autoFocus
                onClick={() => setIsCreateCollectionShown(false)}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
