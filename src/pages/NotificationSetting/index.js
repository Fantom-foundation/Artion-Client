import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useWeb3React } from '@web3-react/core';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import { useApi } from 'api';
import { getSigner } from 'contracts';
import toast from 'utils/toast';

import styles from './styles.module.scss';

const selfSettings = [
  {
    value: 'sBundleBuy',
    label: 'Bundle Purchased',
  },
  {
    value: 'sBundleSell',
    label: 'Bundle Sold',
  },
  {
    value: 'sBundleOffer',
    label: 'Get a new offer for your bundle',
  },
  {
    value: 'sBundleOfferCancel',
    label: 'An offer to you bundle called off',
  },
  {
    value: 'sNftAuctionPrice',
    label: "Your bid's Auction Price update",
  },
  {
    value: 'sNftBidToAuction',
    label: 'A bid to your NFT auction',
  },
  {
    value: 'sNftBidToAuctionCancel',
    label: 'A bid to your NFT called off',
  },
  {
    value: 'sAuctionWin',
    label: 'You won the auction',
  },
  {
    value: 'sAuctionOfBidCancel',
    label: "Your bid's auction called off",
  },
  {
    value: 'sNftSell',
    label: 'NFT Sold',
  },
  {
    value: 'sNftBuy',
    label: 'NFT Purchased',
  },
  {
    value: 'sNftOffer',
    label: 'Get a new offer for your NFT',
  },
  {
    value: 'sNftOfferCancel',
    label: 'An offer to your NFT called off',
  },
];

const followerSettings = [
  {
    value: 'fBundleCreation',
    label: 'New bundle creation by follower',
  },
  {
    value: 'fBundleList',
    label: 'Bundle Listing by follower',
  },
  {
    value: 'fBundlePrice',
    label: 'Bundle Price Update by follower',
  },
  {
    value: 'fNftAuctionPrice',
    label: 'NFT Auction Price update by follower',
  },
  {
    value: 'fNftList',
    label: 'NFT Listing by follower',
  },
  {
    value: 'fNftAuction',
    label: 'New NFT Auction',
  },
  {
    value: 'fNftPrice',
    label: 'NFT Price Update by follower',
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

const SettingOption = ({ name, label, checked, disabled, onChange }) => (
  <FormControlLabel
    className={cx(styles.formControl, checked && styles.selected)}
    control={
      <CustomCheckbox
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        name={name}
      />
    }
    label={label}
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
    dispatch(HeaderActions.toggleSearchbar(false));
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
      try {
        const { data: nonce } = await getNonce(account, authToken);
        const signer = await getSigner();
        signature = await signer.signMessage(
          `Approve Signature on Artion.io with nonce ${nonce}`
        );
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
        signature
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
      <Header light />
      <div className={styles.inner}>
        <div className={styles.title}>Notification Settings</div>

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
            label="Your Activity Notifications"
          />
          <div className={styles.groupOptions}>
            {selfSettings.map((option, idx) => (
              <SettingOption
                key={idx}
                name={option.value}
                label={option.label}
                disabled={!getSetting('fNotification')}
                checked={
                  getSetting('fNotification') && getSetting(option.value)
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
                checked={getSetting('sNotification')}
                onChange={handleChange}
                name="sNotification"
              />
            }
            label="Follower Activity Notifications"
          />
          <div className={styles.groupOptions}>
            {followerSettings.map((option, idx) => (
              <SettingOption
                key={idx}
                name={option.value}
                label={option.label}
                disabled={!getSetting('sNotification')}
                checked={
                  getSetting('sNotification') && getSetting(option.value)
                }
                onChange={handleChange}
              />
            ))}
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
