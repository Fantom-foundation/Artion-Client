import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';

import { Categories } from 'constants/filter.constants';
import { ADMIN_ADDRESS } from 'constants/index';
import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import toast from 'utils/toast';
import { useApi } from 'api';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/svgs/discord.svg';
import telegramIcon from 'assets/svgs/telegram.svg';
import twitterIcon from 'assets/svgs/twitter.svg';
import instagramIcon from 'assets/svgs/instagram.svg';
import mediumIcon from 'assets/svgs/medium.svg';
import nftIcon from 'assets/svgs/nft_active.svg';

import styles from './styles.module.scss';

const CollectionCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { account } = useWeb3React();

  const {
    explorerUrl,
    fetchPendingCollections,
    approveCollection,
    rejectCollection,
  } = useApi();

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
  }, []);

  useEffect(() => {
    if (account && authToken) {
      if (account === ADMIN_ADDRESS) {
        fetchCollections();
      } else {
        history.replace('/');
      }
    }
  }, [account, authToken]);

  const init = async () => {
    setLoading(true);
    setIndex(null);
    fetchCollections();
  };

  const fetchCollections = async () => {
    try {
      const { status, data } = await fetchPendingCollections(authToken);
      if (status === 'success') {
        setLoading(false);
        setCollections(data);
      } else {
        history.replace('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectedCategories = Categories.filter(
    cat =>
      index !== null &&
      collections[index].categories.indexOf(cat.id.toString()) > -1
  );

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveCollection(collections[index].erc721Address, authToken);
      toast('success', 'Collection Approved!');
      init();
    } catch (err) {
      console.log(err);
    }
    setApproving(false);
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await rejectCollection(
        collections[index].erc721Address,
        reason,
        authToken
      );
      toast('success', 'Collection Rejected!');
      init();
    } catch (err) {
      console.log(err);
    }
    setRejecting(false);
  };

  return (
    <div className={styles.container}>
      <Header light />
      {loading ? (
        <div className={styles.loadingPanel}>
          <ClipLoader color="#3D3D3D" size={40} />
        </div>
      ) : index === null ? (
        <div className={styles.inner}>
          {collections.map((collection, idx) => (
            <div
              className={styles.collection}
              key={idx}
              onClick={() => setIndex(idx)}
            >
              <img
                src={`https://gateway.pinata.cloud/ipfs/${collection.logoImageHash}`}
                className={styles.collectionLogo}
              />
              <div className={styles.collectionName}>
                {collection.collectionName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.title}>Review Collection</div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle}>Logo image</div>
            <div className={styles.inputWrapper}>
              <div className={styles.logoUploadBox}>
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${collections[index].logoImageHash}`}
                />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Name</div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                value={collections[index].collectionName}
                disabled
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Description</div>
            <div className={styles.inputWrapper}>
              <textarea
                className={cx(styles.input, styles.longInput)}
                value={collections[index].description}
                disabled
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Royalty</div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                value={collections[index].royalty}
                disabled
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Fee Recipient</div>
            <div className={styles.inputWrapper}>
              <input
                className={styles.input}
                value={collections[index].feeRecipient}
                disabled
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle}>Category</div>
            <div className={cx(styles.inputWrapper, styles.categoryList)}>
              {selectedCategories.map((cat, idx) => (
                <div className={styles.selectedCategory} key={idx}>
                  <img src={cat.icon} className={styles.categoryIcon} />
                  <span className={styles.categoryLabel}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle}>Links</div>
            <div className={styles.inputWrapper}>
              <div className={styles.linksWrapper}>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={nftIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    {explorerUrl()}/address/{collections[index].erc721Address}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={webIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    https://{collections[index].siteUrl}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={discordIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    https://discord.gg/{collections[index].discord}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={twitterIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    @{collections[index].twitterHandle}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={instagramIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    @{collections[index].instagramHandle}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={mediumIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    @{collections[index].mediumHandle}
                  </div>
                </div>
                <div className={styles.linkItem}>
                  <div className={styles.linkIconWrapper}>
                    <img src={telegramIcon} className={styles.linkIcon} />
                  </div>
                  <div className={styles.inputPrefix}>
                    https://t.me/{collections[index].telegram}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Reason</div>
            <div className={styles.inputWrapper}>
              <textarea
                className={cx(styles.input, styles.longInput)}
                maxLength={500}
                placeholder="Tell them why you rejected their collection"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <div className={styles.lengthIndicator}>{reason.length}/500</div>
            </div>
          </div>

          <div className={styles.buttonsWrapper}>
            <div
              className={cx(
                styles.createButton,
                (approving || rejecting) && styles.disabled
              )}
              onClick={handleApprove}
            >
              {approving ? <ClipLoader color="#FFF" size={16} /> : 'Approve'}
            </div>
            <div
              className={cx(
                styles.rejectButton,
                (approving || rejecting) && styles.disabled
              )}
              onClick={handleReject}
            >
              {rejecting ? <ClipLoader color="#FFF" size={16} /> : 'Reject'}
            </div>
            <div
              className={cx(
                styles.cancelButton,
                (approving || rejecting) && styles.disabled
              )}
              onClick={() => setIndex(null)}
            >
              Back
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionCreate;
