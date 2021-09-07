import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import { useApi } from 'api';
import { getSigner } from 'contracts';
import toast from 'utils/toast';

import styles from './styles.module.scss';

const selfSettings = [
  {
    value: 'sBundleBuy',
    title: 'Bundle Purchased',
    description: 'You have purchased a bundle.',
  },
  {
    value: 'sBundleSell',
    title: 'Bundle Sold',
    description: 'Your bundle is sold.',
  },
  {
    value: 'sBundleOffer',
    title: 'Get a new offer for your bundle',
    description: 'You get an offer for your bundle.',
  },
  {
    value: 'sBundleOfferCancel',
    title: 'An offer to you bundle called off',
    description: 'An offer to your bundle is canceled.',
  },
  {
    value: 'sNftAuctionPrice',
    title: "Your bid's Auction Price update",
    description: 'The bid price to your auction is updated.',
  },
  {
    value: 'sNftBidToAuction',
    title: 'A bid to your NFT auction',
    description: 'You get a bid to your auction.',
  },
  {
    value: 'sNftBidToAuctionCancel',
    title: 'A bid to your NFT called off',
    description: 'A bid to your auction is canceled.',
  },
  {
    value: 'sAuctionWin',
    title: 'You won the auction',
    description: 'You purchased an nft in auction.',
  },
  {
    value: 'sAuctionOfBidCancel',
    title: "Your bid's auction called off",
    description: 'An auction you made a bid is canceled.',
  },
  {
    value: 'sNftSell',
    title: 'NFT Sold',
    description: 'Your nft item is sold.',
  },
  {
    value: 'sNftBuy',
    title: 'NFT Purchased',
    description: 'You purchased a new nft item.',
  },
  {
    value: 'sNftOffer',
    title: 'Get a new offer for your NFT',
    description: 'You get an offer to your nft item.',
  },
  {
    value: 'sNftOfferCancel',
    title: 'An offer to your NFT called off',
    description: 'An offer to your nft item is canceled.',
  },
];

const followerSettings = [
  {
    value: 'fBundleCreation',
    title: 'New bundle creation by follower',
    description: 'Created a new bundle.',
  },
  {
    value: 'fBundleList',
    title: 'Bundle Listing by follower',
    description: 'Listed a bundle for sale.',
  },
  {
    value: 'fBundlePrice',
    title: 'Bundle Price Update by follower',
    description: 'Updated the bundle sale price.',
  },
  {
    value: 'fNftAuctionPrice',
    title: 'NFT Auction Price update by follower',
    description: 'Updated auction price.',
  },
  {
    value: 'fNftList',
    title: 'NFT Listing by follower',
    description: 'Listed an nft item for sale.',
  },
  {
    value: 'fNftAuction',
    title: 'New NFT Auction',
    description: 'Started a new auction.',
  },
  {
    value: 'fNftPrice',
    title: 'NFT Price Update by follower',
    description: 'Updated nft item price on sale.',
  },
];

const CustomCheckbox = withStyles({
  root: {
    '&$checked': {
      color: '#1969FF',
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

const SettingOption = ({
  name,
  title,
  description,
  checked,
  disabled,
  onChange,
}) => (
  <FormControlLabel
    classes={{ root: styles.optionPanel }}
    control={
      <CustomCheckbox
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        name={name}
      />
    }
    label={
      <div className={styles.option}>
        <div className={styles.optionTitle}>{title}</div>
        <div className={styles.optionDesc}>{description}</div>
      </div>
    }
  />
);

const NotificationSetting = () => {
  const dispatch = useDispatch();

  const { account } = useWeb3React();
  const {
    getNonce,
    getNotificationSettings,
    updateNotificationSettings,
  } = useApi();
  const { authToken } = useSelector(state => state.ConnectWallet);

  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});

  const getSettings = async () => {
    const { data } = await getNotificationSettings(authToken);
    setSettings(data);
  };

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
  }, []);

  useEffect(() => {
    if (authToken) {
      getSettings();
    }
  }, [authToken]);

  const handleChange = e => {
    const key = e.target.name;
    const newSettings = { ...settings };
    newSettings[key] = !settings[key];
    setSettings(newSettings);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let signature;
      let addr;
      try {
        const { data: nonce } = await getNonce(account, authToken);
        const signer = await getSigner();
        const msg = `Approve Signature on Artion.io with nonce ${nonce}`;
        signature = await signer.signMessage(msg);
        addr = ethers.utils.verifyMessage(msg, signature);
      } catch (err) {
        toast(
          'error',
          'You need to sign the message to be able to update your settings.'
        );
        setSaving(false);
        return;
      }
      const { status } = await updateNotificationSettings(
        settings,
        authToken,
        signature,
        addr
      );
      if (status === 'success') {
        toast('success', 'Notification settings updated!');
      }
    } catch (err) {
      console.log(err);
    }
    setSaving(false);
  };

  const getSetting = key =>
    settings[key] === undefined ? true : settings[key];

  return (
    <div className={styles.container}>
      <Header border />
      <div className={styles.inner}>
        <div className={styles.title}>Notification Settings</div>

        <div className={styles.body}>
          <div className={styles.group}>
            <FormControlLabel
              className={cx(styles.formControl, styles.selected)}
              classes={{ label: styles.groupTitle }}
              control={
                <CustomCheckbox
                  checked={getSetting('sNotification')}
                  onChange={handleChange}
                  name="sNotification"
                />
              }
              label="Your Activity Notifications"
            />
            <div className={styles.groupOptions}>
              {selfSettings.map((option, idx) => (
                <SettingOption
                  key={idx}
                  name={option.value}
                  title={option.title}
                  description={option.description}
                  disabled={!getSetting('sNotification')}
                  checked={
                    getSetting('sNotification') && getSetting(option.value)
                  }
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <FormControlLabel
              className={cx(styles.formControl, styles.selected)}
              classes={{ label: styles.groupTitle }}
              control={
                <CustomCheckbox
                  checked={getSetting('fNotification')}
                  onChange={handleChange}
                  name="fNotification"
                />
              }
              label="Follower Activity Notifications"
            />
            <div className={styles.groupOptions}>
              {followerSettings.map((option, idx) => (
                <SettingOption
                  key={idx}
                  name={option.value}
                  title={option.title}
                  description={option.description}
                  disabled={!getSetting('fNotification')}
                  checked={
                    getSetting('fNotification') && getSetting(option.value)
                  }
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <div
            className={cx(styles.createButton, saving && styles.disabled)}
            onClick={!saving ? handleSave : null}
          >
            {saving ? <ClipLoader color="#FFF" size={16} /> : 'Save Settings'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
