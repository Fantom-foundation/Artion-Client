import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import { ClipLoader } from 'react-spinners';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import HeaderActions from 'actions/header.actions';
import Header from 'components/header';

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

const SettingOption = ({ name, label, checked, onChange }) => (
  <FormControlLabel
    className={cx(styles.formControl, checked && styles.selected)}
    control={
      <CustomCheckbox checked={checked} onChange={onChange} name={name} />
    }
    label={label}
  />
);

const NotificationSetting = () => {
  const dispatch = useDispatch();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  const handleChange = () => {};

  const handleSave = async () => {
    setSaving(true);
    setSaving(false);
  };

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
                checked={true}
                onChange={() => {}}
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
                checked={true}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <FormControlLabel
            className={cx(styles.formControl, styles.selected)}
            classes={{ label: styles.groupTitle }}
            control={<CustomCheckbox onChange={() => {}} name="buyNow" />}
            label="Follower Activity Notifications"
          />
          <div className={styles.groupOptions}>
            {followerSettings.map((option, idx) => (
              <SettingOption
                key={idx}
                name={option.value}
                label={option.label}
                checked={true}
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
